import { test, expect } from "../../fixtures/pages.fixture";
import {
  generateNewUser,
  generateAccountDetails,
  generatePaymentDetails,
} from "../../test-data/factories";

// Journey: New User Registration & Checkout
// Business goal: acquire a new customer end-to-end (highest revenue risk if broken)
// Covers original test cases: #9 Search Product, #12 Add Products in Cart,
// #15 Place Order: Register before Checkout, #23 Verify address details in checkout page,
// #24 Download Invoice after purchase order
test.describe("New User Registration & Checkout Journey", () => {
  test("registers a new account and reaches the logged-in state", async ({
    loginPage,
    signupPage,
  }) => {
    const user = generateNewUser();
    const account = generateAccountDetails();

    await loginPage.goto();
    await loginPage.dismissCookieConsentIfPresent();
    await loginPage.startSignup(user.name, user.email);
    await expect(signupPage.accountInfoHeading).toBeVisible();

    await signupPage.fillAccountInfo(user.password, account);
    await signupPage.submitAccountCreation();
    await expect(signupPage.accountCreatedHeading).toBeVisible();

    await signupPage.continueAfterAccountCreated();
    await expect(signupPage.loggedInAsText).toContainText(user.name);
  });

  test("adds a product to the cart, checks out, pays, and downloads the invoice", async ({
    page,
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

    await test.step("register a new account", async () => {
      await loginPage.goto();
      await loginPage.dismissCookieConsentIfPresent();
      await loginPage.startSignup(user.name, user.email);
      await signupPage.fillAccountInfo(user.password, account);
      await signupPage.submitAccountCreation();
      await signupPage.continueAfterAccountCreated();
      await expect(signupPage.loggedInAsText).toContainText(user.name);
    });

    await test.step("add a product to the cart", async () => {
      await productsPage.goto();
      const name = (
        await productsPage.productCards.first().locator("p").first().innerText()
      ).trim();
      await productsPage.addFirstProductToCart();
      await productsPage.goToCartFromModal();
      await expect(cartPage.rowByProductName(name)).toBeVisible();
    });

    await test.step("proceed to checkout and verify the address", async () => {
      await cartPage.proceedToCheckout();
      await expect(checkoutPage.deliveryAddress).toContainText(account.address);
      await expect(checkoutPage.deliveryAddress).toContainText(account.city);
      await checkoutPage.placeOrder();
    });

    await test.step("pay and confirm the order", async () => {
      await paymentPage.fillCardDetails(card);
      await paymentPage.submitPayment();
      await expect(paymentPage.orderPlacedHeading).toBeVisible();
    });

    await test.step("download the invoice", async () => {
      const downloadPromise = page.waitForEvent("download");
      await paymentPage.downloadInvoiceLink.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe("invoice.txt");
    });
  });
});
