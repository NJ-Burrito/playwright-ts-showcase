import { test, expect, createBooking } from '../../fixtures/api';
import { newBooking } from '../../data/bookings';

// Shape every booking returned by the API must have (schema-style check).
const bookingShape = {
  firstname: expect.any(String),
  lastname: expect.any(String),
  totalprice: expect.any(Number),
  depositpaid: expect.any(Boolean),
  bookingdates: { checkin: expect.any(String), checkout: expect.any(String) },
};

test.describe('Booking CRUD', () => {
  test('create returns an id and echoes the booking', async ({ request, token }) => {
    const payload = newBooking({ firstname: 'Create', totalprice: 321 });
    const { id, body } = await createBooking(request, payload);

    expect(id).toBeGreaterThan(0);
    expect(body.booking).toMatchObject(payload);
    expect(body.booking).toMatchObject(bookingShape);

    await request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
  });

  test('get returns the stored booking', async ({ request, booking }) => {
    const res = await request.get(`/booking/${booking.id}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject(bookingShape);
    expect(body).toMatchObject(booking.payload);
  });

  test('get on an unknown id returns 404', async ({ request }) => {
    const res = await request.get('/booking/999999999');
    expect(res.status()).toBe(404);
  });

  test('list contains the new booking id', async ({ request, booking }) => {
    const res = await request.get('/booking', { params: { firstname: booking.payload.firstname } });
    expect(res.status()).toBe(200);
    const list: { bookingid: number }[] = await res.json();
    expect(list.length).toBeGreaterThan(0);
    for (const entry of list) expect(entry.bookingid).toEqual(expect.any(Number));
    expect(list.map((e) => e.bookingid)).toContain(booking.id);
  });

  test('update (PUT) replaces the booking', async ({ request, booking, token }) => {
    const updated = newBooking({ firstname: 'Updated', totalprice: 999, depositpaid: false });
    const res = await request.put(`/booking/${booking.id}`, {
      data: updated,
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(updated);

    const check = await (await request.get(`/booking/${booking.id}`)).json();
    expect(check).toMatchObject(updated);
  });

  test('partial update (PATCH) changes only the sent fields', async ({
    request,
    booking,
    token,
  }) => {
    const res = await request.patch(`/booking/${booking.id}`, {
      data: { lastname: 'Patched' },
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.lastname).toBe('Patched');
    expect(body.firstname).toBe(booking.payload.firstname);
  });

  test('update without a token is forbidden', async ({ request, booking }) => {
    const res = await request.put(`/booking/${booking.id}`, { data: newBooking() });
    expect(res.status()).toBe(403);
  });

  test('delete removes the booking', async ({ request, booking, token }) => {
    const del = await request.delete(`/booking/${booking.id}`, {
      headers: { Cookie: `token=${token}` },
    });
    // Restful-Booker answers 201 Created on a successful delete.
    expect(del.status()).toBe(201);

    const after = await request.get(`/booking/${booking.id}`);
    expect(after.status()).toBe(404);
  });
});
