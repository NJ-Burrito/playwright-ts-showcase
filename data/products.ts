export const products = {
  backpack: { name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { name: 'Sauce Labs Bike Light', price: 9.99 },
  onesie: { name: 'Sauce Labs Onesie', price: 7.99 },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', price: 49.99 },
} as const;

export const TAX_RATE = 0.08;

// Order total as the checkout summary shows it: item total plus 8% tax, rounded to cents.
export function orderTotal(itemTotal: number): string {
  return (Math.round(itemTotal * (1 + TAX_RATE) * 100) / 100).toFixed(2);
}
