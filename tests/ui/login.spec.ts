import { test, expect, loggedOut } from '../../fixtures/ui';
import { users } from '../../data/users';

test.describe('Login', () => {
  test.use(loggedOut);

  test('valid user reaches the product list', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked-out user sees an error and stays on the login page', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectError('Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.wrongPassword.username, users.wrongPassword.password);
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('empty form asks for a username', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginButton.click();
    await loginPage.expectError('Username is required');
  });

  test('protected page redirects to login when there is no session', async ({
    page,
    loginPage,
  }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.expectError('when you are logged in');
  });
});
