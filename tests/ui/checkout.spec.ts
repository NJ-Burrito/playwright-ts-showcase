import { test, expect } from '../../fixtures/ui';
import { products } from '../../data/products';
import { checkoutCustomer } from '../../data/users';

test.describe('Checkout', () => {
  test('happy path ends on the order confirmation', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.openCart();
    await cartPage.checkoutButton.click();

    await checkoutPage.fillCustomer(checkoutCustomer);
    await expect(page).toHaveURL(/checkout-step-two/);
    // 29.99 item total + 8% tax (2.40) = 32.39
    await expect(checkoutPage.summaryTotal).toHaveText('Total: $32.39');

    await checkoutPage.finish();
    await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!');
  });

  test('first name is required', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.onesie.name);
    await inventoryPage.openCart();
    await cartPage.checkoutButton.click();

    await checkoutPage.continueButton.click();
    await expect(checkoutPage.error).toContainText('First Name is required');
  });
});
