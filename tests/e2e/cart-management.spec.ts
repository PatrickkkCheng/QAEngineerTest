import { test, expect } from "../../fixtures/pages.fixture";
import {
  generateNewUser,
  generateAccountDetails,
} from "../../test-data/factories";

// Journey: Shopping Cart Management
// Business goal: cart data integrity — incorrect items/quantities directly affect order accuracy and revenue
// Covers original test cases: #12 Add Products in Cart, #13 Verify Product quantity in Cart,
// #17 Remove Products From Cart, #20 Search Products and Verify Cart After Login
test.describe("Shopping Cart Management Journey", () => {
  test("adds a product to the cart and shows it in the cart", async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.goto();
    const name = (
      await productsPage.productCards.first().locator("p").first().innerText()
    ).trim();

    await productsPage.addFirstProductToCart();
    await productsPage.goToCartFromModal();

    await expect(cartPage.rowByProductName(name)).toBeVisible();
  });

  // The cart's quantity column is a disabled (non-editable) button — quantity is set on
  // the product detail page *before* adding to cart, not adjusted afterwards in the cart.
  test("reflects the quantity chosen on the product page in the cart", async ({
    productsPage,
    productDetailPage,
    cartPage,
  }) => {
    await productsPage.goto();
    const name = (
      await productsPage.productCards.first().locator("p").first().innerText()
    ).trim();
    await productsPage.openProductDetails(name);

    await productDetailPage.setQuantity(4);
    await productDetailPage.addToCart();
    await productDetailPage.goToCartFromModal();

    await expect(
      cartPage.rowByProductName(name).locator(".cart_quantity"),
    ).toHaveText("4");
  });

  test("removes a product from the cart", async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.goto();
    const name = (
      await productsPage.productCards.first().locator("p").first().innerText()
    ).trim();
    await productsPage.addFirstProductToCart();
    await productsPage.goToCartFromModal();
    await expect(cartPage.rowByProductName(name)).toBeVisible();

    await cartPage.removeProduct(name);

    await expect(cartPage.rowByProductName(name)).toHaveCount(0);
  });

  test("keeps cart contents after logging in", async ({
    productsPage,
    cartPage,
    loginPage,
    signupPage,
  }) => {
    const user = generateNewUser();
    const account = generateAccountDetails();

    // Add to cart as a guest first.
    await productsPage.goto();
    const name = (
      await productsPage.productCards.first().locator("p").first().innerText()
    ).trim();
    await productsPage.addFirstProductToCart();
    await productsPage.goToCartFromModal();

    // Follow the site's actual flow: checkout while logged out is blocked by a modal
    // whose "Register / Login" link is what takes you to the signup form — going there
    // directly (skipping this path) is what caused the cart to appear empty after login.
    await cartPage.proceedToCheckout();
    await cartPage.goToRegisterOrLoginFromModal();
    await loginPage.dismissCookieConsentIfPresent();
    await loginPage.startSignup(user.name, user.email);
    await signupPage.fillAccountInfo(user.password, account);
    await signupPage.submitAccountCreation();
    await signupPage.continueAfterAccountCreated();
    await expect(signupPage.loggedInAsText).toContainText(user.name);

    await cartPage.goto();
    await expect(cartPage.rowByProductName(name)).toBeVisible();
  });
});
