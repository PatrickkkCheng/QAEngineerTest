import { test, expect } from '../../fixtures/pages.fixture';
import { generateNewUser, generateAccountDetails, generatePaymentDetails } from '../../test-data/factories';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';

// Journey: Existing User Login & Checkout
// Business goal: enable repeat purchases from returning customers (higher lifetime value)
// Covers original test cases: #2 Login User with correct email and password,
// #16 Place Order: Login before Checkout, #12 Add Products in Cart,
// #24 Download Invoice after purchase order
//
// Note: the original third scenario planned for this journey ("shows the order in the
// account after checkout completes") isn't testable — this site has no order-history page
// (the "Logged in as X" nav item isn't a link, and there's no /account or /orders route).
test.describe('Existing User Login & Checkout Journey', () => {
  // Registers first so there's a real account to log back into — this exercises the
  // LoginPage form itself, not just the auto-logged-in state right after signing up.
  async function registerAndLogout(
    { loginPage, signupPage }: { loginPage: LoginPage; signupPage: SignupPage },
    user: ReturnType<typeof generateNewUser>,
    account: ReturnType<typeof generateAccountDetails>,
  ) {
    await loginPage.goto();
    await loginPage.dismissCookieConsentIfPresent();
    await loginPage.startSignup(user.name, user.email);
    await signupPage.fillAccountInfo(user.password, account);
    await signupPage.submitAccountCreation();
    await signupPage.continueAfterAccountCreated();
    await signupPage.logout();
  }

  test('logs in with valid credentials and reaches the logged-in state', async ({
    loginPage,
    signupPage,
  }) => {
    const user = generateNewUser();
    const account = generateAccountDetails();
    await registerAndLogout({ loginPage, signupPage }, user, account);

    await expect(loginPage.loginEmailInput).toBeVisible();
    await loginPage.login(user.email, user.password);

    await expect(signupPage.loggedInAsText).toContainText(user.name);
  });

  test('completes a purchase while authenticated', async ({
    loginPage,
    signupPage,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage,
  }) => {
    const user = generateNewUser();
    const account = generateAccountDetails();
    const card = generatePaymentDetails();

    await test.step('register, log out, then log back in', async () => {
      await registerAndLogout({ loginPage, signupPage }, user, account);
      await loginPage.login(user.email, user.password);
      await expect(signupPage.loggedInAsText).toContainText(user.name);
    });

    await test.step('add a product to the cart', async () => {
      await productsPage.goto();
      const name = (await productsPage.productCards.first().locator('p').first().innerText()).trim();
      await productsPage.addFirstProductToCart();
      await productsPage.goToCartFromModal();
      await expect(cartPage.rowByProductName(name)).toBeVisible();
    });

    await test.step('check out and pay', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.placeOrder();
      await paymentPage.fillCardDetails(card);
      await paymentPage.submitPayment();
      await expect(paymentPage.orderPlacedHeading).toBeVisible();
    });
  });
});
