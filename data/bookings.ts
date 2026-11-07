export type BookingPayload = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

export function newBooking(overrides: Partial<BookingPayload> = {}): BookingPayload {
  return {
    firstname: 'Test',
    lastname: 'Guest',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

// Public demo credentials documented by the Restful-Booker API.
export const adminCredentials = { username: 'admin', password: 'password123' };
