import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../../config/constants';
import { users } from '../../data/users';
import { LoginPage } from '../../pages/LoginPage';

// Runs once before the UI project: logs in and saves the session to disk,
// so UI tests do not repeat the login form.
setup('authenticate as standard_user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: STORAGE_STATE });
});
