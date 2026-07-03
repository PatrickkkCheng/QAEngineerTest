import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

// Represents https://automationexercise.com/login
export class LoginPage extends BasePage {
  readonly consentButton: Locator;

  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly signupErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.consentButton = page.getByRole("button", { name: "Consent" });

    this.loginEmailInput = page.getByTestId("login-email");
    this.loginPasswordInput = page.getByTestId("login-password");
    this.loginButton = page.getByTestId("login-button");
    // TODO: verify exact wording via codegen when scripting the "wrong password" scenario.
    this.loginErrorMessage = page.getByText(/incorrect/i);

    this.signupNameInput = page.getByTestId("signup-name");
    this.signupEmailInput = page.getByTestId("signup-email");
    this.signupButton = page.getByTestId("signup-button");
    this.signupErrorMessage = page.getByText("Email Address already exist!");
  }

  async goto() {
    await super.goto("/login");
  }

  async dismissCookieConsentIfPresent() {
    await this.consentButton.click({ timeout: 3000 }).catch(() => {});
  }

  async login(email: string, password: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}
