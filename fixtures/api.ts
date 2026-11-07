import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { adminCredentials, newBooking, type BookingPayload } from '../data/bookings';

type ApiFixtures = {
  token: string;
  // A booking created for this test only and deleted afterwards, so parallel tests never share data.
  booking: { id: number; payload: BookingPayload };
};

export async function createBooking(request: APIRequestContext, payload: BookingPayload) {
  const res = await request.post('/booking', { data: payload });
  expect(res.status()).toBe(200);
  const body = await res.json();
  return { id: body.bookingid as number, body };
}

export const test = base.extend<ApiFixtures>({
  token: async ({ request }, use) => {
    const res = await request.post('/auth', { data: adminCredentials });
    expect(res.ok()).toBeTruthy();
    const { token } = await res.json();
    await use(token);
  },
  booking: async ({ request, token }, use) => {
    const payload = newBooking();
    const { id } = await createBooking(request, payload);
    await use({ id, payload });
    // Cleanup. Harmless when the test already deleted it (the API answers 405 then).
    await request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
  },
});

export { expect };
