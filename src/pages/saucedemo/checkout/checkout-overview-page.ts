import { Locator, Page } from '@playwright/test';
import SauceDemoPage from '@pages/saucedemo/saucedemo-page';
import InventoryPage from '@pages/saucedemo/inventory-page';
import CheckoutCompletePage from '@pages/saucedemo/checkout/checkout-complete-page';

export default class CheckoutOverviewPage extends SauceDemoPage {
  private readonly overviewContainer: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly paymentInfo: Locator;
  private readonly shippingInfo: Locator;

  constructor(page: Page) {
    super(page);
    this.overviewContainer = page.getByTestId('checkout-summary-container');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.paymentInfo = page.getByTestId('payment-info-label').locator('..').locator('.summary_value_label');
    this.shippingInfo = page.getByTestId('shipping-info-label').locator('..').locator('.summary_value_label');
  }

  overviewContainerLocator(): Locator {
    return this.overviewContainer;
  }

  overviewItemNameLocator(name: string): Locator {
    return this.page.getByTestId('inventory-item-name').filter({ hasText: name });
  }

  subtotalLabelLocator(): Locator {
    return this.subtotalLabel;
  }

  taxLabelLocator(): Locator {
    return this.taxLabel;
  }

  totalLabelLocator(): Locator {
    return this.totalLabel;
  }

  paymentInfoLocator(): Locator {
    return this.paymentInfo;
  }

  shippingInfoLocator(): Locator {
    return this.shippingInfo;
  }

  async finishOrder(): Promise<CheckoutCompletePage> {
    await this.finishButton.click();
    return new CheckoutCompletePage(this.page);
  }

  async cancelCheckout(): Promise<InventoryPage> {
    await this.cancelButton.click();
    return new InventoryPage(this.page);
  }
}
