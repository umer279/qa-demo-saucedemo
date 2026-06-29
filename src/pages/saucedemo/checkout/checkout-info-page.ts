import { Locator, Page } from '@playwright/test';
import SauceDemoPage from '@pages/saucedemo/saucedemo-page';
import CartPage from '@pages/saucedemo/cart-page';
import CheckoutOverviewPage from '@pages/saucedemo/checkout/checkout-overview-page';

export type CheckoutInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export default class CheckoutInfoPage extends SauceDemoPage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.errorButton = page.getByTestId('error');
  }

  firstNameInputLocator(): Locator {
    return this.firstNameInput;
  }

  lastNameInputLocator(): Locator {
    return this.lastNameInput;
  }

  postalCodeInputLocator(): Locator {
    return this.postalCodeInput;
  }

  errorButtonLocator(): Locator {
    return this.errorButton;
  }

  async fillCheckoutInfo(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async submitCheckoutInfo(): Promise<CheckoutOverviewPage> {
    await this.continueButton.click();
    return new CheckoutOverviewPage(this.page);
  }

  async continueWithInfo(info: CheckoutInfo): Promise<CheckoutOverviewPage> {
    await this.fillCheckoutInfo(info);
    return this.submitCheckoutInfo();
  }

  async cancelCheckout(): Promise<CartPage> {
    await this.cancelButton.click();
    return new CartPage(this.page);
  }

  async dismissError(): Promise<void> {
    await this.errorButton.locator('button').click();
  }
}
