import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

// Represents https://automationexercise.com/payment
export type PaymentDetails = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

export class PaymentPage extends BasePage {
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;

  readonly orderPlacedHeading: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nameOnCardInput = page.getByTestId("name-on-card");
    this.cardNumberInput = page.getByTestId("card-number");
    this.cvcInput = page.getByTestId("cvc");
    this.expiryMonthInput = page.getByTestId("expiry-month");
    this.expiryYearInput = page.getByTestId("expiry-year");
    this.payButton = page.getByTestId("pay-button");

    this.orderPlacedHeading = page.getByText("ORDER PLACED!");
    this.downloadInvoiceLink = page.getByRole("link", {
      name: "Download Invoice",
    });
    this.continueButton = page.getByTestId("continue-button");
  }

  async fillCardDetails(details: PaymentDetails) {
    await this.nameOnCardInput.fill(details.nameOnCard);
    await this.cardNumberInput.fill(details.cardNumber);
    await this.cvcInput.fill(details.cvc);
    await this.expiryMonthInput.fill(details.expiryMonth);
    await this.expiryYearInput.fill(details.expiryYear);
  }

  async submitPayment() {
    await this.payButton.click();
  }
}
