import { test, expect } from '@fixtures/fe-fixtures';

const BACKPACK_SLUG = 'sauce-labs-backpack';
const BACKPACK_NAME = 'Sauce Labs Backpack';

test.describe('SauceDemo cart', () => {
  test.describe.configure({ mode: 'parallel' });

  test('TC-FE-SDM-CRT-001 — Cart lists added item with quantity and price', async ({
    inventoryPage,
  }) => {
    await test.step('Add backpack and open cart', async () => {
      await inventoryPage.addProductToCart(BACKPACK_SLUG);
    });

    const cart = await inventoryPage.openCart();

    await test.step('Verify cart item details', async () => {
      await expect(cart.cartContentsLocator()).toBeVisible();
      await expect(cart.cartItemsLocator()).toHaveCount(1);
      await expect(cart.cartItemNameLocator(BACKPACK_NAME)).toBeVisible();
      await expect(cart.cartItemQuantityLocator()).toHaveText('1');
      await expect(cart.cartItemPriceLocator()).toHaveText('$29.99');
    });
  });

  test('TC-FE-SDM-CRT-002 — Removing item from cart empties cart', async ({ inventoryPage }) => {
    await test.step('Add backpack and open cart', async () => {
      await inventoryPage.addProductToCart(BACKPACK_SLUG);
    });

    const cart = await inventoryPage.openCart();

    await test.step('Remove item from cart', async () => {
      await cart.removeProductFromCart(BACKPACK_SLUG);
    });

    await test.step('Verify cart is empty and badge is hidden', async () => {
      await expect(cart.cartItemsLocator()).toHaveCount(0);
      await expect(cart.cartBadgeLocator()).not.toBeVisible();
    });
  });
});
