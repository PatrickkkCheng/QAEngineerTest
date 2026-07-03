import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export type AccountDetails = {
  title?: "Mr." | "Mrs.";
  day?: string;
  month?: string;
  year?: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

// Represents https://automationexercise.com/signup
export class SignupPage extends BasePage {
  readonly accountInfoHeading: Locator;
  readonly passwordInput: Locator;
  readonly daySelect: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;
  readonly loggedInAsText: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.accountInfoHeading = page.getByText("ENTER ACCOUNT INFORMATION");
    this.passwordInput = page.getByTestId("password");
    this.daySelect = page.getByTestId("days");
    this.monthSelect = page.getByTestId("months");
    this.yearSelect = page.getByTestId("years");
    this.firstNameInput = page.getByTestId("first_name");
    this.lastNameInput = page.getByTestId("last_name");
    this.addressInput = page.getByTestId("address");
    this.countrySelect = page.getByTestId("country");
    this.stateInput = page.getByTestId("state");
    this.cityInput = page.getByTestId("city");
    this.zipcodeInput = page.getByTestId("zipcode");
    this.mobileNumberInput = page.getByTestId("mobile_number");
    this.createAccountButton = page.getByTestId("create-account");

    this.accountCreatedHeading = page.getByText("ACCOUNT CREATED!");
    this.continueButton = page.getByRole("link", { name: "Continue" });
    this.loggedInAsText = page.getByText(/Logged in as/i);
    this.logoutLink = page.getByRole("link", { name: "Logout" });
  }

  async logout() {
    await this.logoutLink.click();
  }

  async fillAccountInfo(password: string, details: AccountDetails) {
    await this.page
      .getByRole("radio", { name: details.title ?? "Mr." })
      .check();
    await this.passwordInput.fill(password);
    await this.daySelect.selectOption(details.day ?? "1");
    await this.monthSelect.selectOption(details.month ?? "1");
    await this.yearSelect.selectOption(details.year ?? "1990");
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.addressInput.fill(details.address);
    await this.countrySelect.selectOption(details.country);
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileNumberInput.fill(details.mobileNumber);
  }

  async submitAccountCreation() {
    await this.createAccountButton.click();
  }

  async continueAfterAccountCreated() {
    await this.continueButton.click();
  }
}
