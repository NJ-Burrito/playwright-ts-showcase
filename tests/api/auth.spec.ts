import { test, expect } from '../../fixtures/api';
import { adminCredentials } from '../../data/bookings';

test.describe('Auth', () => {
  test('valid credentials return a token', async ({ request }) => {
    const res = await request.post('/auth', { data: adminCredentials });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token).toEqual(expect.any(String));
    expect(body.token.length).toBeGreaterThan(5);
  });

  test('invalid credentials return a reason and no token', async ({ request }) => {
    const res = await request.post('/auth', {
      data: { username: adminCredentials.username, password: 'wrong' },
    });
    // This API answers 200 with a reason field instead of a 401.
    const body = await res.json();
    expect(body).toEqual({ reason: 'Bad credentials' });
    expect(body).not.toHaveProperty('token');
  });
});
