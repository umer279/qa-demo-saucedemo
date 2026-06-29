import { test, expect } from '@fixtures/fe-fixtures';
import { users, checkoutData } from '@config/input-data';

const BACKPACK_SLUG = 'sauce-labs-backpack';
const BACKPACK_NAME = 'Sauce Labs Backpack';

test.describe('SauceDemo checkout', { tag: ['@smoke', '@critical'] }, () => {
  test('TC-FE-SDM-CHK-001 — Empty checkout form shows first name required error', async ({
    inventoryPage,
  }) => {
    await test.step('Add item and proceed to checkout', async () => {
      await inventoryPage.addProductToCart(BACKPACK_SLUG);
    });

    const cart = await inventoryPage.openCart();
    const checkoutInfo = await cart.proceedToCheckout();

    await test.step('Submit empty checkout form', async () => {
      await checkoutInfo.submitCheckoutInfo();
    });

    await test.step('Verify validation error', async () => {
      await expect(checkoutInfo.errorButtonLocator()).toContainText('First Name is required');
    });
  });

  test('TC-FE-SDM-E2E-001 — Complete purchase flow from login to back home', async ({
    loginPage,
  }) => {
    let inventory = await test.step('Log in as standard user', async () => {
      return loginPage.login(users.standard.username, users.standard.password);
    });

    await test.step('Add backpack to cart', async () => {
      await inventory.addProductToCart(BACKPACK_SLUG);
      await expect(inventory.cartBadgeLocator()).toHaveText('1');
    });

    const cart = await test.step('Open cart', async () => {
      return inventory.openCart();
    });

    await test.step('Verify cart item before checkout', async () => {
      await expect(cart.cartItemNameLocator(BACKPACK_NAME)).toBeVisible();
    });

    const checkoutInfo = await test.step('Proceed to checkout information', async () => {
      const info = await cart.proceedToCheckout();
      await expect(info.firstNameInputLocator()).toBeVisible();
      await expect(info.lastNameInputLocator()).toBeVisible();
      await expect(info.postalCodeInputLocator()).toBeVisible();
      return info;
    });

    const overview = await test.step('Fill checkout info and continue', async () => {
      return checkoutInfo.continueWithInfo(checkoutData.valid);
    });

    await test.step('Verify order overview totals', async () => {
      await expect(overview.overviewContainerLocator()).toBeVisible();
      await expect(overview.overviewItemNameLocator(BACKPACK_NAME)).toBeVisible();
      await expect(overview.subtotalLabelLocator()).toContainText('$29.99');
      await expect(overview.taxLabelLocator()).toContainText('$2.40');
      await expect(overview.totalLabelLocator()).toContainText('$32.39');
    });

    const complete = await test.step('Finish order', async () => {
      return overview.finishOrder();
    });

    await test.step('Verify order confirmation', async () => {
      await expect(complete.completeHeaderLocator()).toHaveText('Thank you for your order!');
    });

    inventory = await test.step('Return to inventory via Back Home', async () => {
      return complete.backHome();
    });

    await test.step('Verify inventory is shown with empty cart', async () => {
      await expect(inventory.inventoryContainerLocator()).toBeVisible();
      await expect(inventory.cartBadgeLocator()).not.toBeVisible();
    });
  });
});
