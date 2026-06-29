# AGENTS.md — SauceDemo QA

Playwright test layout for [SauceDemo](https://www.saucedemo.com/) (Swag Labs e-commerce UI).

## Tooling (strict)

| Purpose | Tool |
|---------|------|
| Browser / UI inspection | **playwright-cli** only — [`.cursor/skills/playwright-cli/SKILL.md`](.cursor/skills/playwright-cli/SKILL.md) |

**Forbidden for UI:** `cursor-ide-browser` MCP, any MCP browser driver.

## Commands

```bash
npm run playwright -- tests/frontend/saucedemo --project=chromium
npm run playwright -- --grep @smoke
test_env=dev npm run playwright
npm run generate-docs
```

Config: [`src/config/playwright.config.ts`](src/config/playwright.config.ts). Env: `envs/.env.local` | `.env.dev` | `.env.prod` via `test_env`.

## UI flows (playwright-cli)

1. `playwright-cli open https://www.saucedemo.com/` (or `BASE_URL` from env).
2. **Snapshot** — locate form fields and product refs.
3. Use `data-test` locators (`getByTestId`) — SauceDemo exposes `data-test` attributes.
4. Demo users: `standard_user` / `secret_sauce` (see [`src/data/input-data/saucedemo-users.json`](src/data/input-data/saucedemo-users.json)).

## Architecture

- Specs: `tests/frontend/saucedemo/`
- POM: `src/pages/saucedemo/`
- Fixtures: `fe-fixtures` (`loginPage`, `inventoryPage`)
- Test plan: [`docs/SAUCEDEMO_TEST_PLAN.md`](docs/SAUCEDEMO_TEST_PLAN.md)
- TC naming: [`docs/TEST_NAMING.md`](docs/TEST_NAMING.md)

## Rules

| Rule | Scope |
|------|--------|
| [core.mdc](.cursor/rules/core.mdc) | Always |
| [spec-authoring.mdc](.cursor/rules/spec-authoring.mdc) | `tests/**/*.spec.ts` |
| [pom-authoring.mdc](.cursor/rules/pom-authoring.mdc) | `src/pages/**` |
| [fixtures-and-helpers.mdc](.cursor/rules/fixtures-and-helpers.mdc) | `src/fixtures/**`, `src/test-helpers/**` |

**AGENTS.md wins** over skills when they conflict (e.g. no `expect()` in POMs).
