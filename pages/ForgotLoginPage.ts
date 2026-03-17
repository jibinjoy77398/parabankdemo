import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * OOP: Inheritance + Polymorphism
 * INTERFACE: Implements IPage via BasePage (goto + getPageTitle)
 */
export class ForgotLoginPage extends BasePage {
  private readonly firstNameInput = '#firstName';
  private readonly lastNameInput  = '#lastName';
  private readonly addressInput   = '[id="address.street"]';
  private readonly cityInput      = '[id="address.city"]';
  private readonly stateInput     = '[id="address.state"]';
  private readonly zipCodeInput   = '[id="address.zipCode"]';
  private readonly ssnInput       = '#ssn';
  private readonly submitButton   = 'button:has-text("Find My Login Info")';
  private readonly errorMessage   = '.error';

  constructor(page: Page) {
    super(page);
  }

  // ── IPage contract ─────────────────────────────────────────────────────────
  getPageTitle(): string {
    return 'Customer Lookup';
  }

  async goto(): Promise<void> {
    await this.navigateTo('https://parabank.parasoft.com/parabank/lookup.htm');
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  async fillLookupForm(details: Record<string, string>): Promise<void> {
    await this.fillInput(this.firstNameInput, details.firstName);
    await this.fillInput(this.lastNameInput,  details.lastName);
    await this.fillInput(this.addressInput,   details.address);
    await this.fillInput(this.cityInput,      details.city);
    await this.fillInput(this.stateInput,     details.state);
    await this.fillInput(this.zipCodeInput,   details.zipCode);
    await this.fillInput(this.ssnInput,       details.ssn);
  }

  async submit(): Promise<void> {
    await this.clickElement(this.submitButton);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }
}
