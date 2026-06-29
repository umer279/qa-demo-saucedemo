# SauceDemo Test Plan

Test matrix for [SauceDemo](https://www.saucedemo.com/) (Swag Labs). Automated regression tests live in `tests/frontend/saucedemo/`.

## Automation summary

| Area | Total scenarios | Automated | Not automated |
|------|-----------------|-----------|---------------|
| Authentication | 10 | 4 | 6 |
| Inventory | 11 | 4 | 7 |
| Product detail | 3 | 0 | 3 |
| Cart | 4 | 2 | 2 |
| Checkout | 11 | 6 | 5 |
| Navigation / session | 5 | 1 | 4 |
| End-to-end | 2 | 1 | 1 |
| **Total** | **46** | **18** | **28** |

---

## 1. Authentication (`LOG`)

| ID | Scenario | Priority | Automated | TC |
|----|----------|----------|-----------|-----|
| LOG-01 | Login page shows username/password fields and accepted-credentials hint | High | Yes | `TC-FE-SDM-LOG-001` |
| LOG-02 | Valid login (`standard_user`) lands on inventory | Critical | Yes | `TC-FE-SDM-LOG-002` |
| LOG-03 | Invalid username/password shows error | High | Yes | `TC-FE-SDM-LOG-003` |
| LOG-04 | `locked_out_user` shows lockout message | High | Yes | `TC-FE-SDM-LOG-004` |
| LOG-05 | Empty username or password shows validation error | Medium | No | — |
| LOG-06 | Direct navigation to `/inventory.html` without session redirects to login | Medium | No | — |
| LOG-07 | `performance_glitch_user` login succeeds (slow; timing flaky) | Low | No | — |
| LOG-08 | `problem_user` — broken product images | Low | No | — |
| LOG-09 | `error_user` — checkout/API errors on finish | Low | No | — |
| LOG-10 | `visual_user` — layout/visual glitches | Low | No | — |

---

## 2. Inventory / catalog (`INV`)

| ID | Scenario | Priority | Automated | TC |
|----|----------|----------|-----------|-----|
| INV-01 | All 6 products visible with name, description, price | High | Yes | `TC-FE-SDM-INV-001` |
| INV-02 | Add product to cart — button toggles to Remove, badge increments | Critical | Yes | `TC-FE-SDM-INV-002` |
| INV-03 | Remove product from inventory list — badge decrements | High | Yes | `TC-FE-SDM-INV-003` |
| INV-04 | Sort Name A→Z (default order) | Medium | No | — |
| INV-05 | Sort Name Z→A | Medium | No | — |
| INV-06 | Sort Price low→high | High | Yes | `TC-FE-SDM-INV-004` |
| INV-07 | Sort Price high→low | Medium | No | — |
| INV-08 | Open product detail via title link | Medium | No | — |
| INV-09 | Open product detail via image link | Low | No | — |
| INV-10 | Footer social links open correct external URLs | Low | No | — |
| INV-11 | Footer copyright text present | Low | No | — |

---

## 3. Product detail (`PDP`)

| ID | Scenario | Priority | Automated | TC |
|----|----------|----------|-----------|-----|
| PDP-01 | Detail page shows name, description, price, image | Medium | No | — |
| PDP-02 | Add/remove from detail page syncs cart badge | Medium | No | — |
| PDP-03 | Back to products returns to inventory | Medium | No | — |

---

## 4. Cart (`CRT`)

| ID | Scenario | Priority | Automated | TC |
|----|----------|----------|-----------|-----|
| CRT-01 | Cart lists added items with correct QTY and price | High | Yes | `TC-FE-SDM-CRT-001` |
| CRT-02 | Remove item from cart empties cart / updates badge | High | Yes | `TC-FE-SDM-CRT-002` |
| CRT-03 | Continue Shopping returns to inventory with cart preserved | Medium | No | — |
| CRT-04 | Checkout with empty cart (edge) | Low | No | — |

---

## 5. Checkout (`CHK`)

| ID | Scenario | Priority | Automated | TC |
|----|----------|----------|-----------|-----|
| CHK-01 | Checkout step 1 shows First Name, Last Name, Zip fields | High | Yes | `TC-FE-SDM-E2E-001` |
| CHK-02 | Valid info proceeds to overview | Critical | Yes | `TC-FE-SDM-E2E-001` |
| CHK-03 | Empty submit shows `First Name is required` | High | Yes | `TC-FE-SDM-CHK-001` |
| CHK-04 | Missing last name shows `Last Name is required` | Medium | No | — |
| CHK-05 | Missing postal code shows `Postal Code is required` | Medium | No | — |
| CHK-06 | Cancel on step 1 returns to cart with items | Medium | No | — |
| CHK-07 | Overview shows item, subtotal, tax, total | Critical | Yes | `TC-FE-SDM-E2E-001` |
| CHK-08 | Finish completes order — thank-you message | Critical | Yes | `TC-FE-SDM-E2E-001` |
| CHK-09 | Back Home clears cart and returns to inventory | High | Yes | `TC-FE-SDM-E2E-001` |
| CHK-10 | Cancel on overview returns to inventory | Low | No | — |
| CHK-11 | Multi-item order — totals sum correctly | Medium | No | — |

---

## 6. Navigation / session (`NAV`)

| ID | Scenario | Priority | Automated | TC |
|----|----------|----------|-----------|-----|
| NAV-01 | Burger menu opens and closes | Medium | No | — |
| NAV-02 | Logout returns to login page | High | Yes | `TC-FE-SDM-LOG-005` |
| NAV-03 | All Items from menu returns to inventory | Low | No | — |
| NAV-04 | Reset App State clears cart/session | Low | No | — |
| NAV-05 | About link navigates externally | Low | No | — |

---

## 7. End-to-end (`E2E`)

| ID | Scenario | Priority | Automated | TC |
|----|----------|----------|-----------|-----|
| E2E-01 | Full purchase: login → add item → checkout → complete → back home | Critical | Yes | `TC-FE-SDM-E2E-001` |
| E2E-02 | Full purchase with 2+ items and total validation | Medium | No | — |

---

## Run automated regression

```bash
npm run playwright -- tests/frontend/saucedemo --project=chromium
npm run playwright -- --grep @smoke
```
