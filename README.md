# QA Automation Exercise

Playwright + TypeScript end-to-end regression tests for https://automationexercise.com.

## User Journeys

After reviewing the application, I identified these six key user journeys.

| User Journey                 | Why it matters                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| First-time customer purchase | Covers the complete acquisition and purchase flow from registration to order confirmation. |
| Returning customer purchase  | Represents the most common purchase scenario for existing users.                           |
| Product search and browsing  | Users must be able to discover products before making a purchase.                          |
| Shopping cart management     | Ensures items, quantities and cart state remain accurate.                                  |
| Account validation           | Covers common authentication failures such as duplicate registration and invalid login.    |
| Contact Us submission        | Verifies the customer support channel is working correctly.                                |

### Automated Journeys

For this exercise I automated first 4 from above journeys:

- New user registration and checkout
- Existing user login and checkout
- Product search and browsing
- Shopping cart management

These represent the site's core purchase flow and provide the highest regression value. The remaining journeys are good candidates for future coverage.

---

## Framework

**Playwright + TypeScript**

Reasons:

- Reliable cross-browser automation
- Built-in tracing, reporting and debugging
- Strong TypeScript support
- Good fit for modern web applications

---

## Project Structure

```text
pages/          Page Objects
fixtures/       Shared fixtures
reporters/      Custom console
test-data/      Test data generation
tests/e2e/      End-to-end scenarios
playwright.config.ts
```

## Quick start

Install dependencies and browsers:

```bash
npm install
npx playwright install
```

Run test:

```bash
npm test
npm run test:headed   # see browser actions
npm run test:ui       # interactive mode
npm run report        # view last HTML report
```
