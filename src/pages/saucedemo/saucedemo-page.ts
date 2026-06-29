import { Locator, Page } from '@playwright/test';
import BasePage from '@pages/base-page';
import InventoryPage from '@pages/saucedemo/inventory-page';

export default class SauceDemoPage extends BasePage {
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly burgerMenuButton: Locator;
  private readonly closeMenuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly allItemsLink: Locator;
  private readonly aboutLink: Locator;
  private readonly resetAppStateLink: Locator;
  private readonly sidebarMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.burgerMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.aboutLink = page.getByTestId('about-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
    this.sidebarMenu = page.getByTestId('block');
  }

  cartLinkLocator(): Locator {
    return this.cartLink;
  }

  cartBadgeLocator(): Locator {
    return this.cartBadge;
  }

  sidebarMenuLocator(): Locator {
    return this.sidebarMenu;
  }

  async cartBadgeCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) {
      return 0;
    }
    return Number.parseInt((await this.cartBadge.textContent()) ?? '0', 10);
  }

  protected async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openBurgerMenu(): Promise<void> {
    await this.burgerMenuButton.click();
  }

  async closeBurgerMenu(): Promise<void> {
    await this.closeMenuButton.click();
  }

  async navigateToAllItems(): Promise<InventoryPage> {
    await this.openBurgerMenu();
    await this.allItemsLink.click();
    return new InventoryPage(this.page);
  }

  async resetAppState(): Promise<void> {
    await this.openBurgerMenu();
    await this.resetAppStateLink.click();
    await this.closeBurgerMenu();
  }

  async logout(): Promise<void> {
    await this.openBurgerMenu();
    await this.logoutLink.click();
  }

  aboutLinkLocator(): Locator {
    return this.aboutLink;
  }
}
