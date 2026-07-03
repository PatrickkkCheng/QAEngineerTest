import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { PaymentPage } from "../pages/PaymentPage";

// Remove the Ads
const AD_HOST_PATTERNS = [
  /googlesyndication\.com/,
  /doubleclick\.net/,
  /adsbygoogle/,
  /google-analytics\.com/,
  /googletagmanager\.com/,
];

type Pages = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
};

export const test = base.extend<Pages>({
  page: async ({ page }, use) => {
    await page.route("**/*", (route) => {
      const url = route.request().url();
      if (AD_HOST_PATTERNS.some((pattern) => pattern.test(url))) {
        return route.abort();
      }
      return route.continue();
    });
    await use(page);
  },

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  signupPage: async ({ page }, use) => use(new SignupPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  paymentPage: async ({ page }, use) => use(new PaymentPage(page)),
});

export { expect } from "@playwright/test";
