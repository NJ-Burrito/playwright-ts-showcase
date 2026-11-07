import { test, expect } from '../../fixtures/ui';
import { products } from '../../data/products';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('adding items updates the badge and the cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.bikeLight.name);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.itemNames).toHaveText([products.backpack.name, products.bikeLight.name]);
  });

  test('removing an item clears the badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.onesie.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(products.onesie.name);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
