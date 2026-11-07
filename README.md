# playwright-ts-showcase

[![Playwright](https://github.com/NJ-Burrito/playwright-ts-showcase/actions/workflows/playwright.yml/badge.svg)](https://github.com/NJ-Burrito/playwright-ts-showcase/actions/workflows/playwright.yml)

A small Playwright + TypeScript test project by Nader Alzghoul (QA Automation Engineer). It tests two public practice sites that exist for automation training, so nothing here touches a real product or real data.

| Target                                                        | Used for                            | Project in config |
| ------------------------------------------------------------- | ----------------------------------- | ----------------- |
| [saucedemo.com](https://www.saucedemo.com)                    | UI tests (shop: login, cart, order) | `chromium`        |
| [restful-booker](https://restful-booker.herokuapp.com/apidoc) | API tests (hotel bookings, CRUD)    | `api`             |

## What it tests

26 tests in total (measured with `npm test`): 1 setup test, 13 UI tests and 12 API tests.

- **Login (5):** valid user, locked-out user, wrong password, empty form, protected page without a session.
- **Cart (2):** add items and see the badge and cart page update; remove an item.
- **Sorting (3):** name Z to A and back, price low to high, price high to low.
- **Checkout (2):** happy path to the confirmation page (including the order total), and the missing first name error.
- **Accessibility (1):** an axe-core scan of the product page; it fails on critical or serious WCAG A/AA violations. It is a guard, not a full accessibility audit.
- **API auth (2):** token for valid credentials; no token for bad credentials.
- **API bookings (10):** create, create with an invalid payload (the API answers 500), get, get unknown id (404), list with a filter, full update (PUT), partial update (PATCH), update without a token (403), delete without a token (403), delete then confirm 404. Responses are checked for field names and types, not only status codes.

## How to run

Requires Node.js 20.19 or newer (CI runs 24).

```bash
npm ci
npx playwright install chromium   # once, downloads the browser
npm test                          # everything
npm run test:ui                   # setup + UI tests
npm run test:api                  # API tests only
npm run report                    # open the last HTML report
npm run lint
npm run typecheck
npm run format:check
```

## Layout

```
pages/       Page objects (one class per page)
fixtures/    ui.ts injects page objects, api.ts provides a token and a throwaway booking
data/        Test data: users, products, booking payloads
tests/
  setup/     Logs in once and saves the session
  ui/        UI specs
  api/       API specs
```

## Design choices

- **Page Object Model.** Each page class owns its locators and exposes actions (`login`, `addToCart`, `sortBy`). Page classes own locators and actions; specs hold the business assertions. Pages keep only small guard assertions (the page has loaded, an error is shown). When the UI changes, one file changes.
- **Custom fixtures.** Specs ask for `loginPage`, `inventoryPage` and so on in their arguments instead of creating them. The API fixtures give each test its own booking and delete it afterwards, so parallel tests never share or depend on each other's data.
- **storageState.** A `setup` project logs in once and saves the session to `.auth/standard-user.json`. The `chromium` project depends on it and starts every test already logged in. Login tests opt out with an empty state.
- **Locator strategy.** Role, label and placeholder first (`getByRole`, `getByPlaceholder`), then test ids (`getByTestId`, configured to saucedemo's `data-test` attribute) where the page gives no accessible handle. No CSS or XPath chains.
- **No fixed sleeps.** Assertions auto-wait. Where a list is re-sorted, the test uses `expect.poll`. ESLint rejects `waitForTimeout`.
- **Retries.** 0 locally so a flaky test is noticed, 2 on CI because the targets are shared public sites. A trace is recorded on the first retry and a screenshot on failure. Both are in the HTML report.
- **Parallel.** `fullyParallel` is on. Tests are independent, which is why the booking fixture creates and cleans up its own data.
- **CI.** `.github/workflows/playwright.yml` runs lint, format check, typecheck and the tests on `ubuntu-latest` and uploads the HTML report. Actions are pinned to full commit SHAs.

## Known limits

- The targets are public and shared. If saucedemo or restful-booker is down or slow, tests fail for reasons that are not in this code.
- Restful-Booker has quirks the tests encode on purpose: bad credentials answer 200 with a `reason`, and a successful delete answers 201.
- Chromium only. Adding Firefox or WebKit is a new entry in `projects`.

## Author

Nader Alzghoul, GitHub [NJ-Burrito](https://github.com/NJ-Burrito).

## License

MIT, see [LICENSE](LICENSE).
