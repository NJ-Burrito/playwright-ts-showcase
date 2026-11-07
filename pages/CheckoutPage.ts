import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly summaryTotal: Locator;
  readonly confirmationHeader: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.postalCode = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.summaryTotal = page.getByTestId('total-label');
    this.confirmationHeader = page.getByTestId('complete-header');
    this.error = page.getByTestId('error');
  }

  async fillCustomer(customer: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}
