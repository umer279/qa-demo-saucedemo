import { test, expect } from '@fixtures/fe-fixtures';

const BACKPACK_SLUG = 'sauce-labs-backpack';

test.describe('SauceDemo inventory', { tag: ['@smoke', '@critical'] }, () => {
  test.describe.configure({ mode: 'parallel' });

  test('TC-FE-SDM-INV-001 — Inventory shows six products', async ({ inventoryPage }) => {
    await test.step('Verify product list is visible', async () => {
      await expect(inventoryPage.inventoryContainerLocator()).toBeVisible();
      await expect(inventoryPage.inventoryItemsLocator()).toHaveCount(6);
    });
  });

  test('TC-FE-SDM-INV-002 — Adding product to cart updates badge and button', async ({
    inventoryPage,
  }) => {
    await test.step('Add backpack to cart', async () => {
      await inventoryPage.addProductToCart(BACKPACK_SLUG);
    });

    await test.step('Verify cart badge and remove button', async () => {
      await expect(inventoryPage.cartBadgeLocator()).toHaveText('1');
      await expect(inventoryPage.removeFromCartButton(BACKPACK_SLUG)).toBeVisible();
    });
  });

  test('TC-FE-SDM-INV-003 — Removing product from cart clears badge', async ({ inventoryPage }) => {
    await test.step('Add then remove backpack from cart', async () => {
      await inventoryPage.addProductToCart(BACKPACK_SLUG);
      await inventoryPage.removeProductFromCart(BACKPACK_SLUG);
    });

    await test.step('Verify cart badge is hidden', async () => {
      await expect(inventoryPage.cartBadgeLocator()).not.toBeVisible();
      await expect(inventoryPage.addToCartButton(BACKPACK_SLUG)).toBeVisible();
    });
  });

  test('TC-FE-SDM-INV-004 — Sort by price low to high orders products correctly', async ({
    inventoryPage,
  }) => {
    await test.step('Sort products by price low to high', async () => {
      await inventoryPage.sortBy('Price (low to high)');
    });

    await test.step('Verify prices are in ascending order', async () => {
      const prices = await inventoryPage.getProductPrices();
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sorted);
    });
  });
});
