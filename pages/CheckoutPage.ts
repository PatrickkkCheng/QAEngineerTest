import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

// Represents https://automationexercise.com/checkout
export class CheckoutPage extends BasePage {
  readonly deliveryAddress: Locator;
  readonly orderCommentInput: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.deliveryAddress = page.locator("#address_delivery");
    this.orderCommentInput = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole("link", { name: "Place Order" });
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
