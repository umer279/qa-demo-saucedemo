import { Locator, Page } from '@playwright/test';
import SauceDemoPage from '@pages/saucedemo/saucedemo-page';
import InventoryPage from '@pages/saucedemo/inventory-page';
import CheckoutInfoPage from '@pages/saucedemo/checkout/checkout-info-page';

export default class CartPage extends SauceDemoPage {
  private readonly cartContents: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartContents = page.getByTestId('cart-list');
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  cartContentsLocator(): Locator {
    return this.cartContents;
  }

  cartItemsLocator(): Locator {
    return this.cartItems;
  }

  cartItemNameLocator(name: string): Locator {
    return this.page.getByTestId('inventory-item-name').filter({ hasText: name });
  }

  cartItemQuantityLocator(): Locator {
    return this.page.getByTestId('item-quantity');
  }

  cartItemPriceLocator(): Locator {
    return this.page.getByTestId('inventory-item-price');
  }

  removeFromCartButton(productSlug: string): Locator {
    return this.page.getByTestId(`remove-${productSlug}`);
  }

  async removeProductFromCart(productSlug: string): Promise<void> {
    await this.removeFromCartButton(productSlug).click();
  }

  async proceedToCheckout(): Promise<CheckoutInfoPage> {
    await this.checkoutButton.click();
    return new CheckoutInfoPage(this.page);
  }

  async continueShopping(): Promise<InventoryPage> {
    await this.continueShoppingButton.click();
    return new InventoryPage(this.page);
  }
}
