import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import ts from 'typescript';

const INPUT_FILE = process.argv[2] || 'reports/monocart-report-latest/index.json';
const OUTPUT_FILE = process.argv[3] || 'docs/TEST_CATALOG.md';
const FIXTURES_GLOB = 'src/fixtures/*-fixtures.ts';
const HELPERS_GLOB = 'src/test-helpers/**/*.ts';

/** Resolved from npm script cwd (project root). */
const PROJECT_ROOT = process.cwd();

interface TestCase {
  title: string;
  line?: number;
  tags: string[];
}

interface ScopedTestInfo {
  body: string;
  args: string[];
}

interface ReportNode {
  suiteType?: string;
  title: string;
  type?: string;
  location?: { line: number };
  tags?: string[];
  subs?: ReportNode[];
}

interface ReportData {
  rows?: ReportNode[];
  summary: {
    files: { value: number };
    tests: { value: number };
  };
}

type Entry = { kind: 'step'; text: string } | { kind: 'call'; name: string };
type HelperMap = Record<string, Entry[]>;

interface FunctionLike {
  name: string;
  bodyStart: number;
  bodyEnd: number;
}

function getCleanTitle(filePath: string): string {
  let name = path.basename(filePath);
  name = name.replace(/\.(spec|test)\.(ts|js)$/, '').replace(/\.(ts|js)$/, '');
  name = name.replace(/[.\-_]/g, ' ');
  return name.replace(/\s+/g, ' ').trim().toLowerCase();
}

function sanitizeForTable(str: string | null | undefined): string {
  if (!str) return '—';
  return str
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

function parseSource(filePath: string, content: string): ts.SourceFile {
  return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function collectFunctionLikes(source: ts.SourceFile): FunctionLike[] {
  const out: FunctionLike[] = [];

  const pushBlock = (name: string, block: ts.Block) => {
    out.push({
      name,
      bodyStart: block.getStart(source) + 1,
      bodyEnd: block.getEnd() - 1,
    });
  };

  for (const node of source.statements) {
    if (ts.isFunctionDeclaration(node) && node.name && node.body) {
      pushBlock(node.name.text, node.body);
    } else if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
        const init = decl.initializer;
        if (
          (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) &&
          init.body &&
          ts.isBlock(init.body)
        ) {
          pushBlock(decl.name.text, init.body);
        }
      }
    }
  }

  return out;
}

function collectFixtureLikes(source: ts.SourceFile): FunctionLike[] {
  const out: FunctionLike[] = [];

  const pushBlock = (name: string, block: ts.Block) => {
    out.push({
      name,
      bodyStart: block.getStart(source) + 1,
      bodyEnd: block.getEnd() - 1,
    });
  };

  const handleObjectLiteral = (obj: ts.ObjectLiteralExpression) => {
    for (const prop of obj.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const nameNode = prop.name;
      if (!(ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode))) continue;
      const name = nameNode.text;
      const init = prop.initializer;
      if ((ts.isArrowFunction(init) || ts.isFunctionExpression(init)) && ts.isBlock(init.body)) {
        pushBlock(name, init.body);
      } else if (ts.isObjectLiteralExpression(init)) {
        for (const sub of init.properties) {
          if (!ts.isPropertyAssignment(sub)) continue;
          if (!ts.isIdentifier(sub.name) || sub.name.text !== 'provider') continue;
          const subInit = sub.initializer;
          if (
            (ts.isArrowFunction(subInit) || ts.isFunctionExpression(subInit)) &&
            ts.isBlock(subInit.body)
          ) {
            pushBlock(name, subInit.body);
          }
        }
      }
    }
  };

  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node)) {
      for (const arg of node.arguments) {
        if (ts.isObjectLiteralExpression(arg)) handleObjectLiteral(arg);
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return out;
}

function scanBodyForEntries(body: string, knownNames: Set<string>): Entry[] {
  const found: { pos: number; entry: Entry }[] = [];

  const stepRegex = /(?:test\.)?step\s*\(\s*['"`]([^'"`]*)['"`]/g;
  let sMatch: RegExpExecArray | null;
  while ((sMatch = stepRegex.exec(body)) !== null) {
    found.push({ pos: sMatch.index, entry: { kind: 'step', text: sMatch[1] } });
  }

  if (knownNames.size > 0) {
    const names = [...knownNames].sort((a, b) => b.length - a.length);
    const escapedNames = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const helperRegex = new RegExp(`(?<![\\w$.])(${escapedNames.join('|')})\\s*\\(`, 'g');
    let hMatch: RegExpExecArray | null;
    while ((hMatch = helperRegex.exec(body)) !== null) {
      found.push({ pos: hMatch.index, entry: { kind: 'call', name: hMatch[1] } });
    }
  }

  found.sort((a, b) => a.pos - b.pos);
  return found.map((f) => f.entry);
}

function buildMapFromFunctions(
  content: string,
  fns: FunctionLike[],
  knownNames: Set<string>,
  target: HelperMap,
): void {
  for (const fn of fns) {
    const body = content.slice(fn.bodyStart, fn.bodyEnd);
    target[fn.name] = scanBodyForEntries(body, knownNames);
  }
}

function loadSources(
  filePaths: string[],
): Array<{ filePath: string; content: string; source: ts.SourceFile }> {
  return filePaths
    .filter((f) => fs.existsSync(f))
    .map((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      const source = parseSource(filePath, content);
      return { filePath, content, source };
    });
}

function expand(name: string, map: HelperMap, visited: Set<string> = new Set()): string[] {
  if (visited.has(name) || !map[name]) return [];
  visited.add(name);
  const out: string[] = [];
  for (const entry of map[name]) {
    if (entry.kind === 'step') out.push(entry.text);
    else out.push(...expand(entry.name, map, visited));
  }
  visited.delete(name);
  return out;
}

function getScopedTestInfo(content: string, startIndex: number): ScopedTestInfo {
  const remaining = content.substring(startIndex);
  const headMatch = remaining.match(/(?:async\s*)?\(([^)]*)\)\s*=>\s*\{/);
  if (!headMatch) return { body: '', args: [] };

  const args = headMatch[1]
    .replace(/[{}\s]/g, '')
    .split(',')
    .filter(Boolean);
  const absoluteStart = startIndex + headMatch.index! + headMatch[0].length - 1;

  let openBraces = 0;
  let pos = absoluteStart;
  while (pos < content.length) {
    if (content[pos] === '{') openBraces++;
    if (content[pos] === '}') openBraces--;
    if (openBraces === 0) return { body: content.substring(absoluteStart, pos + 1), args };
    pos++;
  }
  return { body: '', args: [] };
}

function main(): void {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Report not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  const jsonData: ReportData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

  const helperFilePaths = globSync(path.join(PROJECT_ROOT, HELPERS_GLOB));
  const helperSources = loadSources(helperFilePaths);
  const fixtureFilePaths = globSync(path.join(PROJECT_ROOT, FIXTURES_GLOB));
  const fixtureSources = loadSources(fixtureFilePaths);
  if (fixtureSources.length === 0) {
    console.warn(`⚠️ No fixture files matched: ${FIXTURES_GLOB}`);
  }

  const helperFnsByFile: Array<{ content: string; fns: FunctionLike[] }> = [];
  const knownNames = new Set<string>();

  for (const { content, source } of helperSources) {
    const fns = collectFunctionLikes(source);
    helperFnsByFile.push({ content, fns });
    for (const fn of fns) knownNames.add(fn.name);
  }

  const fixtureFnsByFile: Array<{ content: string; fns: FunctionLike[] }> = [];
  for (const { content, source } of fixtureSources) {
    const fns = collectFixtureLikes(source);
    fixtureFnsByFile.push({ content, fns });
    for (const fn of fns) knownNames.add(fn.name);
  }

  const globalMap: HelperMap = {};
  for (const { content, fns } of helperFnsByFile) {
    buildMapFromFunctions(content, fns, knownNames, globalMap);
  }
  for (const { content, fns } of fixtureFnsByFile) {
    buildMapFromFunctions(content, fns, knownNames, globalMap);
  }

  const filesMap = new Map<string, TestCase[]>();
  function traverse(node: ReportNode, currentFile = ''): void {
    if (node.suiteType === 'file') currentFile = node.title;
    if (node.type === 'case') {
      if (!filesMap.has(currentFile)) filesMap.set(currentFile, []);
      filesMap.get(currentFile)!.push({
        title: node.title,
        line: node.location?.line,
        tags: node.tags || [],
      });
    }
    if (node.subs) node.subs.forEach((sub) => traverse(sub, currentFile));
  }
  if (jsonData.rows) jsonData.rows.forEach((row) => traverse(row));

  const sortedFilePaths = Array.from(filesMap.keys()).sort();
  const md: string[] = [];

  md.push(`# Automated Test Catalog (Talentware QA)\n`);
  md.push(
    `### Overview\n\n| Metric | Count |\n| :--- | :--- |\n| **Files** | ${jsonData.summary.files.value} |\n| **Tests** | ${jsonData.summary.tests.value} |\n\n---\n`,
  );

  md.push(`### Table of Contents\n`);
  sortedFilePaths.forEach((fp) => {
    const cleanTitle = getCleanTitle(fp);
    const anchor = cleanTitle.replace(/\s+/g, '-');
    md.push(`- [${cleanTitle}](#${anchor})`);
  });
  md.push(`\n---\n`);

  sortedFilePaths.forEach((filePath) => {
    const tests = filesMap.get(filePath)!;
    const fullPath = [
      path.join(PROJECT_ROOT, 'tests', filePath),
      path.join(PROJECT_ROOT, filePath),
    ].find((p) => fs.existsSync(p));

    const cleanTitle = getCleanTitle(filePath);
    md.push(`## ${cleanTitle}\n`);
    md.push(`**Path:** \`${filePath}\`\n\n| Scenario | Steps | Tags |\n| :--- | :--- | :--- |`);

    if (!fullPath) {
      tests.forEach((t) =>
        md.push(`| **${sanitizeForTable(t.title)}** | ⚠️ Source not found | — |`),
      );
      md.push(`\n---\n`);
      return;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const source = parseSource(fullPath, content);

    const localFns = collectFunctionLikes(source);
    const scopedNames = new Set<string>(knownNames);
    for (const fn of localFns) scopedNames.add(fn.name);

    const fileMap: HelperMap = { ...globalMap };
    buildMapFromFunctions(content, localFns, scopedNames, fileMap);

    tests.forEach((testCase) => {
      const cleanedForSearch = testCase.title
        .replace(/^[A-Z]{2,4}\d+\s*-\s*/g, '')
        .replace(/\[.*?\]/g, '')
        .trim();

      let searchIndex = content.indexOf(cleanedForSearch);

      if (searchIndex === -1) {
        const words = testCase.title.split(/\s+/);
        const partialTitle = words
          .slice(0, 5)
          .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('[\\s\\S]{1,50}');
        const fuzzyRegex = new RegExp(partialTitle);
        const match = content.match(fuzzyRegex);
        if (match && typeof match.index === 'number') {
          searchIndex = match.index;
        }
      }

      if (searchIndex === -1) {
        const words = cleanedForSearch.split(/\s+/);
        for (let i = Math.min(words.length, 6); i >= 2; i--) {
          const staticSuffix = words.slice(-i).join(' ');
          const firstOccur = content.indexOf(staticSuffix);
          if (firstOccur !== -1) {
            searchIndex = firstOccur;
            break;
          }
        }
      }

      const { body, args } =
        searchIndex !== -1 ? getScopedTestInfo(content, searchIndex) : { body: '', args: [] };

      const orderedSteps: string[] = [];

      args.forEach((arg) => {
        const fixtureKey = arg.replace(/:.*$/, '').trim();
        if (fileMap[fixtureKey]) orderedSteps.push(...expand(fixtureKey, fileMap));
      });

      const entries = scanBodyForEntries(body, scopedNames);
      for (const entry of entries) {
        if (entry.kind === 'step') orderedSteps.push(entry.text);
        else orderedSteps.push(...expand(entry.name, fileMap));
      }

      const uniqueSteps = [...new Set(orderedSteps)];
      const stepCell =
        uniqueSteps.length > 0
          ? uniqueSteps.map((s, i) => `${i + 1}. ${sanitizeForTable(s)}`).join('<br>')
          : '—';

      const tags =
        testCase.tags.length > 0 ? testCase.tags.map((t) => `\`${t}\``).join(' ') : '—';
      md.push(
        `| **${sanitizeForTable(testCase.title)}** | ${stepCell} | ${sanitizeForTable(tags)} |`,
      );
    });

    md.push(`\n---\n`);
  });

  const outDir = path.dirname(OUTPUT_FILE);
  if (outDir && outDir !== '.' && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, md.join('\n'), 'utf8');
  console.log(`✅ Success! Documentation generated at ${OUTPUT_FILE}`);
}

main();
