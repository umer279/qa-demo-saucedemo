import { Locator, Page } from '@playwright/test';
import SauceDemoPage from '@pages/saucedemo/saucedemo-page';
import InventoryPage from '@pages/saucedemo/inventory-page';
import CartPage from '@pages/saucedemo/cart-page';

export default class ProductDetailPage extends SauceDemoPage {
  private readonly productName: Locator;
  private readonly productDescription: Locator;
  private readonly productPrice: Locator;
  private readonly productImage: Locator;
  private readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.getByTestId('inventory-item-name');
    this.productDescription = page.getByTestId('inventory-item-desc');
    this.productPrice = page.getByTestId('inventory-item-price');
    this.productImage = page.locator('.inventory_details_img img');
    this.backToProductsButton = page.getByTestId('back-to-products');
  }

  productNameLocator(): Locator {
    return this.productName;
  }

  productDescriptionLocator(): Locator {
    return this.productDescription;
  }

  productPriceLocator(): Locator {
    return this.productPrice;
  }

  productImageLocator(): Locator {
    return this.productImage;
  }

  addToCartButton(productSlug: string): Locator {
    return this.page.getByTestId(`add-to-cart-${productSlug}`);
  }

  removeFromCartButton(productSlug: string): Locator {
    return this.page.getByTestId(`remove-${productSlug}`);
  }

  async addProductToCart(productSlug: string): Promise<void> {
    await this.addToCartButton(productSlug).click();
  }

  async removeProductFromCart(productSlug: string): Promise<void> {
    await this.removeFromCartButton(productSlug).click();
  }

  async backToProducts(): Promise<InventoryPage> {
    await this.backToProductsButton.click();
    return new InventoryPage(this.page);
  }

  async openCart(): Promise<CartPage> {
    await this.navigateToCart();
    return new CartPage(this.page);
  }
}
