# Test naming

## Spec files

- Pattern: `{feature}.spec.ts` in **kebab-case** under `tests/frontend/saucedemo/`.
- Example area: `saucedemo/` for SauceDemo e-commerce flows.

## Test case IDs

```text
TC-{FE}-{DOMAIN}-{FEATURE}-{NNN} — <English description>
```

| Part | Meaning |
|------|---------|
| `FE` | Frontend / UI spec |
| `DOMAIN` | Product slice (`SDM` = SauceDemo) |
| `FEATURE` | File-level code (see table) |
| `NNN` | Three-digit counter within the same spec file |

### DOMAIN codes

| Code | Scope |
|------|--------|
| `SDM` | SauceDemo (`tests/frontend/saucedemo/`) |

### FEATURE codes

| File | FEATURE |
|------|---------|
| `saucedemo/login.spec.ts` | `LOG` |
| `saucedemo/inventory.spec.ts` | `INV` |
| `saucedemo/cart.spec.ts` | `CRT` |
| `saucedemo/checkout.spec.ts` | `CHK`, `E2E` |

## Tags

| Tag | Use |
|-----|-----|
| `@smoke` | Fast sanity checks |
| `@critical` | High-priority flows |
