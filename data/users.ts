// Public demo credentials published on https://www.saucedemo.com for practice use.
export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  wrongPassword: { username: 'standard_user', password: 'not-the-password' },
} as const;

export const checkoutCustomer = {
  firstName: 'Test',
  lastName: 'Tester',
  postalCode: '11111',
} as const;
