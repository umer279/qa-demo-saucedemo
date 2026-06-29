import { Locator, Page } from '@playwright/test';
import SauceDemoPage from '@pages/saucedemo/saucedemo-page';
import CartPage from '@pages/saucedemo/cart-page';
import ProductDetailPage from '@pages/saucedemo/product-detail-page';

export default class InventoryPage extends SauceDemoPage {
  private readonly inventoryContainer: Locator;
  private readonly sortDropdown: Locator;
  private readonly inventoryItems: Locator;
  private readonly footerCopy: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryContainer = page.getByTestId('inventory-container');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.footerCopy = page.locator('.footer_copy');
  }

  inventoryContainerLocator(): Locator {
    return this.inventoryContainer;
  }

  inventoryItemsLocator(): Locator {
    return this.inventoryItems;
  }

  footerCopyLocator(): Locator {
    return this.footerCopy;
  }

  socialLinkLocator(name: 'Twitter' | 'Facebook' | 'LinkedIn'): Locator {
    return this.page.getByRole('link', { name });
  }

  productTitleLink(productSlug: string): Locator {
    return this.page.getByTestId(`item-${this.slugToItemId(productSlug)}-title-link`);
  }

  productImageLink(productSlug: string): Locator {
    return this.page.getByTestId(`item-${this.slugToItemId(productSlug)}-img-link`);
  }

  addToCartButton(productSlug: string): Locator {
    return this.page.getByTestId(`add-to-cart-${productSlug}`);
  }

  removeFromCartButton(productSlug: string): Locator {
    return this.page.getByTestId(`remove-${productSlug}`);
  }

  productImageLocator(productSlug: string): Locator {
    return this.productImageLink(productSlug).locator('img');
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  async addProductToCart(productSlug: string): Promise<void> {
    await this.addToCartButton(productSlug).click();
  }

  async removeProductFromCart(productSlug: string): Promise<void> {
    await this.removeFromCartButton(productSlug).click();
  }

  async openProductDetail(productSlug: string): Promise<ProductDetailPage> {
    await this.productTitleLink(productSlug).click();
    return new ProductDetailPage(this.page);
  }

  async openProductDetailViaImage(productSlug: string): Promise<ProductDetailPage> {
    await this.productImageLink(productSlug).click();
    return new ProductDetailPage(this.page);
  }

  async getProductPrices(): Promise<number[]> {
    const priceLocators = this.page.getByTestId('inventory-item-price');
    const count = await priceLocators.count();
    const prices: number[] = [];

    for (let i = 0; i < count; i++) {
      const text = (await priceLocators.nth(i).textContent()) ?? '';
      prices.push(Number.parseFloat(text.replace('$', '')));
    }

    return prices;
  }

  async getProductNames(): Promise<string[]> {
    const nameLocators = this.page.getByTestId('inventory-item-name');
    const count = await nameLocators.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      names.push((await nameLocators.nth(i).textContent()) ?? '');
    }

    return names;
  }

  async openCart(): Promise<CartPage> {
    await this.navigateToCart();
    return new CartPage(this.page);
  }

  private slugToItemId(productSlug: string): string {
    const slugMap: Record<string, string> = {
      'sauce-labs-backpack': '4',
      'sauce-labs-bike-light': '0',
      'sauce-labs-bolt-t-shirt': '1',
      'sauce-labs-fleece-jacket': '5',
      'sauce-labs-onesie': '2',
      'test.allthethings()-t-shirt-(red)': '3',
    };
    return slugMap[productSlug] ?? productSlug;
  }
}
