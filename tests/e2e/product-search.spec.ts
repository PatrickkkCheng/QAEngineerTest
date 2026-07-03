import { test, expect } from '../../fixtures/pages.fixture';

// Journey: Product Search & Browsing
// Business goal: top-of-funnel product discovery — if users can't find products, nothing downstream converts
// Covers original test cases: #9 Search Product, #18 View Category Products,
// #19 View & Cart Brand Products, #8 Verify All Products and product detail page
test.describe('Product Search & Browsing Journey', () => {
  test('returns matching results when searching by keyword', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.search('Top');

    await expect(productsPage.pageHeading).toHaveText('Searched Products');
    await expect(productsPage.productCards.first()).toBeVisible();
  });

  test('shows a no-results state for a keyword with no matches', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.search('zzzznonsensekeyword123');

    await expect(productsPage.pageHeading).toHaveText('Searched Products');
    await expect(productsPage.productCards).toHaveCount(0);
  });

  test('lists products when browsing by category', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.openCategory('Women', 'Dress');

    await expect(productsPage.pageHeading).toContainText('Women - Dress Products');
    await expect(productsPage.productCards.first()).toBeVisible();
  });

  test('lists products when browsing by brand', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.openBrand('Polo');

    await expect(productsPage.pageHeading).toContainText('Brand - Polo Products');
    await expect(productsPage.productCards.first()).toBeVisible();
  });

  test('opens a product detail page from the listing', async ({ productsPage, productDetailPage }) => {
    await productsPage.goto();
    const name = (await productsPage.productCards.first().locator('p').first().innerText()).trim();

    await productsPage.openProductDetails(name);

    await expect(productDetailPage.productNameHeading).toHaveText(name);
  });
});
