import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

// Represents https://automationexercise.com/view_cart
export class CartPage extends BasePage {
  readonly cartRows: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly totalAmount: Locator;
  readonly loginRequiredModal: Locator;
  readonly registerOrLoginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.cartRows = page.locator('tbody tr[id^="product-"]');
    this.proceedToCheckoutButton = page.locator(".check_out");
    this.totalAmount = page.locator(".cart_total_price").last();
    this.loginRequiredModal = page.getByText(
      "Register / Login account to proceed on checkout.",
    );
    this.registerOrLoginLink = page.getByRole("link", {
      name: "Register / Login",
    });
  }

  async goto() {
    await super.goto("/view_cart");
  }

  rowByProductName(name: string): Locator {
    return this.cartRows.filter({ hasText: name });
  }

  async removeProduct(name: string) {
    await this.rowByProductName(name).locator(".cart_quantity_delete").click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async goToRegisterOrLoginFromModal() {
    await this.registerOrLoginLink.click();
  }
}
