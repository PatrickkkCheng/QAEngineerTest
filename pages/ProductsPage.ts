import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

// Works for both '/' (featured products) and '/products' (full listing) — both pages
export class ProductsPage extends BasePage {
  readonly consentButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly pageHeading: Locator;
  readonly productCards: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.consentButton = page.getByRole("button", { name: "Consent" });
    this.searchInput = page.locator("#search_product");
    this.searchButton = page.locator("#submit_search");
    this.pageHeading = page.locator("h2.title");
    this.productCards = page.locator(".product-image-wrapper");
    this.viewCartLink = page.getByRole("link", { name: "View Cart" });
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
  }

  async goto() {
    await super.goto("/products");
    // The cookie-consent banner re-renders on every full page navigation.
    await this.dismissCookieConsentIfPresent();
  }

  async dismissCookieConsentIfPresent() {
    await this.consentButton.click({ timeout: 3000 }).catch(() => {});
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  productCardByName(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  async addToCartByName(name: string) {
    await this.productCardByName(name).locator(".add-to-cart").first().click();
  }

  async addFirstProductToCart() {
    await this.productCards.first().locator(".add-to-cart").first().click();
  }

  async goToCartFromModal() {
    await this.viewCartLink.click();
  }

  // category: the top-level accordion group (e.g. 'Women'); subCategoryLinkText: e.g. 'Dress'
  async openCategory(
    category: "Women" | "Men" | "Kids",
    subCategoryLinkText: string,
  ) {
    await this.page.locator(`a[href="#${category}"]`).click();
    await this.page
      .locator(`#${category}`)
      .getByRole("link", { name: subCategoryLinkText })
      .click();
  }

  async openBrand(brand: string) {
    // Link text includes a "(count)" badge (e.g. " (6)Polo"), so match by href instead of name.
    await this.page.locator(`a[href="/brand_products/${brand}"]`).click();
  }

  async openProductDetails(name: string) {
    await this.productCardByName(name)
      .getByRole("link", { name: "View Product" })
      .first()
      .click();
  }
}
