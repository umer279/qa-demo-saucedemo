import { test, expect } from '@fixtures/fe-fixtures';
import { users } from '@config/input-data';
import LoginPage from '@pages/saucedemo/login-page';

test.describe('SauceDemo login', { tag: ['@smoke', '@critical'] }, () => {
  test.describe.configure({ mode: 'parallel' });

  test('TC-FE-SDM-LOG-001 — Login page shows credentials form and accepted usernames hint', async ({
    loginPage,
  }) => {
    await test.step('Verify login form fields are visible', async () => {
      await expect(loginPage.usernameInputLocator()).toBeVisible();
      await expect(loginPage.passwordInputLocator()).toBeVisible();
    });

    await test.step('Verify accepted usernames hint is shown', async () => {
      await expect(loginPage.loginCredentialsLocator()).toContainText('standard_user');
      await expect(loginPage.loginCredentialsLocator()).toContainText('locked_out_user');
    });
  });

  test('TC-FE-SDM-LOG-002 — Valid credentials land on inventory page', async ({ loginPage }) => {
    await test.step('Log in as standard user', async () => {
      const inventory = await loginPage.login(users.standard.username, users.standard.password);
      await expect(inventory.inventoryContainerLocator()).toBeVisible();
    });
  });

  test('TC-FE-SDM-LOG-003 — Invalid credentials show error message', async ({ loginPage }) => {
    await test.step('Submit invalid credentials', async () => {
      await loginPage.fillCredentials('invalid_user', 'wrong_password');
      await loginPage.clickLogin();
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(loginPage.errorMessageLocator()).toContainText(
        'Username and password do not match',
      );
    });
  });

  test('TC-FE-SDM-LOG-004 — Locked out user shows lockout error', async ({ loginPage }) => {
    await test.step('Submit locked out user credentials', async () => {
      await loginPage.fillCredentials(users.lockedOut.username, users.lockedOut.password);
      await loginPage.clickLogin();
    });

    await test.step('Verify lockout error is displayed', async () => {
      await expect(loginPage.errorMessageLocator()).toContainText(
        'Sorry, this user has been locked out',
      );
    });
  });

  test('TC-FE-SDM-LOG-005 — Logout returns to login page', async ({ inventoryPage, page }) => {
    await test.step('Log out from inventory', async () => {
      await inventoryPage.logout();
    });

    await test.step('Verify login page is shown', async () => {
      await expect(page).toHaveURL('/');
      const loginPage = new LoginPage(page);
      await expect(loginPage.usernameInputLocator()).toBeVisible();
      await expect(loginPage.passwordInputLocator()).toBeVisible();
    });
  });
});
