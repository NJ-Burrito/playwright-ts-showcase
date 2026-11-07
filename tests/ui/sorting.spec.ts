import { test, expect } from '../../fixtures/ui';

const alphabetical = (a: string, b: string) => a.localeCompare(b);

test.describe('Sorting', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('name Z to A, then back to A to Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    await expect
      .poll(async () => {
        const names = await inventoryPage.names();
        return names.join('|') === [...names].sort(alphabetical).reverse().join('|');
      })
      .toBe(true);

    await inventoryPage.sortBy('az');
    await expect
      .poll(async () => {
        const names = await inventoryPage.names();
        return names.join('|') === [...names].sort(alphabetical).join('|');
      })
      .toBe(true);
  });

  test('price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    await expect
      .poll(async () => {
        const prices = await inventoryPage.prices();
        return prices.join() === [...prices].sort((a, b) => a - b).join();
      })
      .toBe(true);
    expect((await inventoryPage.prices())[0]).toBe(7.99);
  });

  test('price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    await expect
      .poll(async () => {
        const prices = await inventoryPage.prices();
        return prices.join() === [...prices].sort((a, b) => b - a).join();
      })
      .toBe(true);
    expect((await inventoryPage.prices())[0]).toBe(49.99);
  });
});
