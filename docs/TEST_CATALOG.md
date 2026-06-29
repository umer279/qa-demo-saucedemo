# Automated Test Catalog (Talentware QA)

### Overview

| Metric | Count |
| :--- | :--- |
| **Files** | 4 |
| **Tests** | 13 |

---

### Table of Contents

- [cart](#cart)
- [checkout](#checkout)
- [inventory](#inventory)
- [login](#login)

---

## cart

**Path:** `frontend/saucedemo/cart.spec.ts`

| Scenario | Steps | Tags |
| :--- | :--- | :--- |
| **TC-FE-SDM-CRT-001 — Cart lists added item with quantity and price** | 1. Add backpack and open cart<br>2. Verify cart item details | — |
| **TC-FE-SDM-CRT-002 — Removing item from cart empties cart** | 1. Add backpack and open cart<br>2. Remove item from cart<br>3. Verify cart is empty and badge is hidden | — |

---

## checkout

**Path:** `frontend/saucedemo/checkout.spec.ts`

| Scenario | Steps | Tags |
| :--- | :--- | :--- |
| **TC-FE-SDM-CHK-001 — Empty checkout form shows first name required error** | 1. Add item and proceed to checkout<br>2. Submit empty checkout form<br>3. Verify validation error | `@smoke` `@critical` |
| **TC-FE-SDM-E2E-001 — Complete purchase flow from login to back home** | 1. Log in as standard user<br>2. Add backpack to cart<br>3. Open cart<br>4. Verify cart item before checkout<br>5. Proceed to checkout information<br>6. Fill checkout info and continue<br>7. Verify order overview totals<br>8. Finish order<br>9. Verify order confirmation<br>10. Return to inventory via Back Home<br>11. Verify inventory is shown with empty cart | `@smoke` `@critical` |

---

## inventory

**Path:** `frontend/saucedemo/inventory.spec.ts`

| Scenario | Steps | Tags |
| :--- | :--- | :--- |
| **TC-FE-SDM-INV-001 — Inventory shows six products** | 1. Verify product list is visible | `@smoke` `@critical` |
| **TC-FE-SDM-INV-002 — Adding product to cart updates badge and button** | 1. Add backpack to cart<br>2. Verify cart badge and remove button | `@smoke` `@critical` |
| **TC-FE-SDM-INV-003 — Removing product from cart clears badge** | 1. Add then remove backpack from cart<br>2. Verify cart badge is hidden | `@smoke` `@critical` |
| **TC-FE-SDM-INV-004 — Sort by price low to high orders products correctly** | 1. Sort products by price low to high<br>2. Verify prices are in ascending order | `@smoke` `@critical` |

---

## login

**Path:** `frontend/saucedemo/login.spec.ts`

| Scenario | Steps | Tags |
| :--- | :--- | :--- |
| **TC-FE-SDM-LOG-001 — Login page shows credentials form and accepted usernames hint** | 1. Verify login form fields are visible<br>2. Verify accepted usernames hint is shown | `@smoke` `@critical` |
| **TC-FE-SDM-LOG-002 — Valid credentials land on inventory page** | 1. Log in as standard user | `@smoke` `@critical` |
| **TC-FE-SDM-LOG-003 — Invalid credentials show error message** | 1. Submit invalid credentials<br>2. Verify error message is displayed | `@smoke` `@critical` |
| **TC-FE-SDM-LOG-004 — Locked out user shows lockout error** | 1. Submit locked out user credentials<br>2. Verify lockout error is displayed | `@smoke` `@critical` |
| **TC-FE-SDM-LOG-005 — Logout returns to login page** | 1. Log out from inventory<br>2. Verify login page is shown | `@smoke` `@critical` |

---
