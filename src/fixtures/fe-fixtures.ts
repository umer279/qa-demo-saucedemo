import { test as base } from '@playwright/test';
import { users } from '@config/input-data';
import LoginPage from '@pages/saucedemo/login-page';
import InventoryPage from '@pages/saucedemo/inventory-page';

type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<SauceDemoFixtures>({
  loginPage: async ({ page }, use) => {
    await page.goto('/');
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await page.goto('/');
    const inventory = await new LoginPage(page).login(
      users.standard.username,
      users.standard.password,
    );
    await use(inventory);
  },
});

export { expect } from '@playwright/test';
