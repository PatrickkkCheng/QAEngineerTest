import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Represents /product_details/<id>. The quantity here is what ends up in the cart —
// the cart page itself only shows a disabled (non-editable) quantity button.
export class ProductDetailPage extends BasePage {
  readonly productNameHeading: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productNameHeading = page.locator('.product-information h2');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('button.cart');
    this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async goToCartFromModal() {
    await this.viewCartLink.click();
  }
}
