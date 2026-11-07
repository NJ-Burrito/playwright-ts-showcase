import { test as base } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

// Page objects are injected per test. The browser context already holds the
// logged-in session (storageState, written once by the "setup" project).
export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
});

export { expect } from '@playwright/test';

// Use with test.use() in a describe block when a test must start logged out.
export const loggedOut = { storageState: { cookies: [], origins: [] } };
