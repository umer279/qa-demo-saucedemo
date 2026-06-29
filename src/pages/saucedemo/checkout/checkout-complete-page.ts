import { Locator, Page } from '@playwright/test';
import SauceDemoPage from '@pages/saucedemo/saucedemo-page';
import InventoryPage from '@pages/saucedemo/inventory-page';

export default class CheckoutCompletePage extends SauceDemoPage {
  private readonly completeHeader: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  completeHeaderLocator(): Locator {
    return this.completeHeader;
  }

  async backHome(): Promise<InventoryPage> {
    await this.backHomeButton.click();
    return new InventoryPage(this.page);
  }
}
