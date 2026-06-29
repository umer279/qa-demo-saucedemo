import { Locator, Page } from '@playwright/test';
import BasePage from '@pages/base-page';
import InventoryPage from '@pages/saucedemo/inventory-page';

export default class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly loginCredentials: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
    this.loginCredentials = page.locator('#login_credentials');
  }

  usernameInputLocator(): Locator {
    return this.usernameInput;
  }

  passwordInputLocator(): Locator {
    return this.passwordInput;
  }

  errorMessageLocator(): Locator {
    return this.errorMessage;
  }

  loginCredentialsLocator(): Locator {
    return this.loginCredentials;
  }

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async submit(): Promise<InventoryPage> {
    await this.clickLogin();
    return new InventoryPage(this.page);
  }

  async login(username: string, password: string): Promise<InventoryPage> {
    await this.fillCredentials(username, password);
    return this.submit();
  }
}
