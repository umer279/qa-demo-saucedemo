# SauceDemo QA (Playwright)

Standalone **test automation** layout for [SauceDemo](https://www.saucedemo.com/) — UI E2E, Page Object Model, living test catalog.

## Architecture

| Layer | Path | Responsibility |
|-------|------|----------------|
| Specs | `tests/frontend/saucedemo/` | Orchestration, assertions, `test.step` labels |
| Page objects | `src/pages/saucedemo/` | Locators and UI actions (no `expect`) |
| Fixtures | `src/fixtures/fe-fixtures.ts` | `loginPage`, `inventoryPage` |
| Test data | `src/data/input-data/` | Users (`saucedemo-users.json`), checkout (`checkout-data.json`) |
| Config | `src/config/` | Playwright, env keys, timeouts |
| Environments | `envs/` | `.env.local` / `.env.dev` / `.env.prod` |

## Test plan

Full test matrix and automation mapping: [`docs/SAUCEDEMO_TEST_PLAN.md`](docs/SAUCEDEMO_TEST_PLAN.md).

## Environment profiles

Loading is handled in [`src/config/env-helper.ts`](src/config/env-helper.ts):

| Command | Env file |
|---------|----------|
| `npm run playwright` | `envs/.env.local` (default) |
| `test_env=dev npm run playwright` | `envs/.env.dev` |
| `test_env=prod npm run playwright` | `envs/.env.prod` |

Copy [`envs/.env.example`](envs/.env.example) when adding keys.

## Quick start

```bash
npm install
npm run playwright:install
npm run playwright -- tests/frontend/saucedemo --project=chromium
```

Smoke-only:

```bash
npm run playwright -- --grep @smoke
```

Typecheck:

```bash
npm run tsc
```

## Test documentation generation

Each run overwrites `reports/monocart-report-latest/` (HTML + `index.json`). Generate the catalog without extra args:

```bash
npm run playwright -- tests/frontend/saucedemo
npm run generate-docs
```

Naming rules: [`docs/TEST_NAMING.md`](docs/TEST_NAMING.md).

## Cursor agent setup

| Asset | Path |
|-------|------|
| Agent playbook | [`AGENTS.md`](AGENTS.md) |
| Rules | [`.cursor/rules/`](.cursor/rules/) (`core.mdc` always on) |
| playwright-cli skill | [`.cursor/skills/playwright-cli/`](.cursor/skills/playwright-cli/) |

## Playwright projects

| Project | `testDir` | Use |
|---------|-----------|-----|
| `chromium` | `tests/frontend` | SauceDemo UI E2E |

## Sample tests

| Spec | IDs | Purpose |
|------|-----|---------|
| `login.spec.ts` | `TC-FE-SDM-LOG-001`–`005` | Login, errors, logout |
| `inventory.spec.ts` | `TC-FE-SDM-INV-001`–`004` | Products, cart badge, sorting |
| `cart.spec.ts` | `TC-FE-SDM-CRT-001`–`002` | Cart contents, remove item |
| `checkout.spec.ts` | `TC-FE-SDM-CHK-001`, `TC-FE-SDM-E2E-001` | Validation, full purchase |
