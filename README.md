# QA Engineer Automation Test Scenario

Playwright (TypeScript) end-to-end regression framework for [automationexercise.com](https://automationexercise.com/).

## 1. Six most important user journeys

Reviewed against the site's own [/test_cases](https://automationexercise.com/test_cases) page (26
official scenarios meant for automation practice) and grouped into higher-level, business-value
journeys.

| #   | User Journey                                                                                   | Business Goal                                                                                              |
| --- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | **New User Registration & Checkout** — register, add to cart, check out, pay, download invoice | Acquire a new customer end-to-end — the core revenue funnel; highest risk if broken                        |
| 2   | **Existing User Login & Checkout** — log in with an existing account, add to cart, check out   | Enable repeat purchases from returning customers (higher lifetime value, different auth code path than #1) |
| 3   | **Product Search & Browsing** — search, browse by category/brand, open a product detail page   | Top-of-funnel discovery — if users can't find products, nothing downstream converts                        |
| 4   | **Shopping Cart Management** — add/remove items, set quantity, cart persists across login      | Cart data integrity — wrong items/quantities directly affect order accuracy and revenue                    |
| 5   | Account Registration & Login Validation — duplicate email, wrong password (negative paths)     | Prevent duplicate accounts and login lockouts, which generate support tickets                              |
| 6   | Customer Support (Contact Us) — submit a support enquiry, get confirmation                     | Lead-gen / support channel, independent of the purchase funnel                                              |

## 2. Four journeys chosen to script, and why

**Scripted: #1, #2, #3, #4.**

- **#1 and #2** sit directly on the payment path — they are where the site makes money, so
  regressions here have the highest business impact. They're also kept as two separate journeys
  (not one) because guest-registration-then-checkout and login-then-checkout exercise different
  session/auth code paths on the backend.
- **#3** is the top of the funnel: if search/browse breaks, the other three journeys never even
  get exercised by a real user, regardless of how well checkout works.
- **#4** covers cart correctness, a common source of real bugs (quantity handling, cart-session
  persistence across login) that directly affects order accuracy.

**Not scripted in this pass:**

- **#5** (negative-path auth validation) — valuable, but lower priority than the four happy-path
  revenue journeys above for an initial regression suite. Natural next addition.
- **#6** (Contact Us) — a lead-gen/support feature disconnected from the core commerce
  transaction; if it breaks, no purchase is blocked and no revenue is at risk, so it's lower
  priority than the four funnel journeys above. Order confirmation and invoice download (the
  outcome of a completed purchase) are still covered — they're scripted as the tail end of
  journey #1 rather than as a standalone journey, since a full separate script would just
  re-run the entire checkout to reach the same screen.

## 3. Framework & language choice

**Playwright + TypeScript.**

- Playwright's own tooling (trace viewer, UI mode, codegen) ships TypeScript-first; the Python/Java/.NET
  bindings tend to lag behind on new features.
- Type safety catches broken Page Object references and locator typos at compile time instead of
  at runtime, which matters once the Page Object count grows (this repo already has 8).
- If the application under test were also JS/TS (common for modern web apps), QA and dev share one
  language, making Page Objects easier for developers to review or contribute to.
- Largest existing community/job-market footprint for Playwright specifically, which matters for
  onboarding new team members onto this framework.

## 4. Framework architecture

```
pages/          Page Object Model — one class per real page/URL (see class-level comments
                for which URL each one represents)
fixtures/       Custom `test`/`expect` that auto-injects Page Objects and blocks the site's
                real AdSense ad network requests (ads intermittently overlap and intercept
                clicks — unrelated to the app under test, so they're blocked for stability)
test-data/      Faker-based factories for unique users/accounts/payment details
reporters/      Custom minimal console reporter (journey + test name, no file path noise)
tests/e2e/      One spec file per scripted journey
playwright.config.ts   Browser/device matrix (desktop x3 + mobile x2), retries/workers tuned
                        down because the target is a live public site, not infra we control
```

Design notes worth knowing before extending this:

- Selectors prefer the site's own `data-qa` attributes (configured as `testIdAttribute`) where
  they exist (account/payment forms); otherwise role/label-based locators, falling back to CSS
  classes only where the site has no better hook (e.g. cart rows, add-to-cart buttons).
- Test data is generated fresh per run (unique email via timestamp) since this is a shared public
  database — hardcoded fixtures would collide with previous runs.
- Local runs use 3 workers and 1 retry (not Playwright's local defaults) specifically because this
  site rate-limits itself ("under heavy load / queue full") under too much concurrent traffic.

## Setup

```bash
npm install
npx playwright install
cp .env.example .env   # BASE_URL already defaults to automationexercise.com
```

## Running tests

```bash
npm test            # headless, all 5 browser/device projects
npm run test:headed # headed, watch it run
npm run test:ui     # Playwright UI mode
npm run test:debug  # step through with the inspector
npm run report      # open the last HTML report
npm run codegen     # record real actions/selectors from the live site
```
