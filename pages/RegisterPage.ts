import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { IRegistrationDetails } from '../interfaces/IRegistrationDetails';

/**
 * OOP: Inheritance (extends BasePage), Polymorphism (overrides getPageTitle, goto)
 * INTERFACE: fillRegistrationForm() now accepts IRegistrationDetails
 *   — typed instead of Record<string, string>, so IDE autocomplete
 *   shows all valid fields, and typos are caught at compile time.
 */
export class RegisterPage extends BasePage {
  // ── Private locators (Encapsulation) ──────────────────────────────────────
  private readonly firstNameInput     = '[id="customer.firstName"]';
  private readonly lastNameInput      = '[id="customer.lastName"]';
  private readonly addressInput       = '[id="customer.address.street"]';
  private readonly cityInput          = '[id="customer.address.city"]';
  private readonly stateInput         = '[id="customer.address.state"]';
  private readonly zipCodeInput       = '[id="customer.address.zipCode"]';
  private readonly phoneNumberInput   = '[id="customer.phoneNumber"]';
  private readonly ssnInput           = '[id="customer.ssn"]';
  private readonly usernameInput      = '[id="customer.username"]';
  private readonly passwordInput      = '[id="customer.password"]';
  private readonly confirmPassInput   = '#repeatedPassword';
  private readonly registerButton     = 'button:has-text("Register"), input[value="Register"]';
  private readonly successTitle       = '.title';

  constructor(page: Page) {
    super(page);
  }

  // ── IPage contract implementation ──────────────────────────────────────────
  getPageTitle(): string {
    return 'Signing up is easy!';
  }

  async goto(): Promise<void> {
    await this.navigateTo('https://parabank.parasoft.com/parabank/register.htm');
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * fillRegistrationForm accepts IRegistrationDetails — a strongly-typed interface
   * instead of Record<string, string>. TypeScript will catch any missing or misspelled
   * fields at compile time.
   */
  async fillRegistrationForm(details: IRegistrationDetails): Promise<void> {
    await this.fillInput(this.firstNameInput,   details.firstName);
    await this.fillInput(this.lastNameInput,    details.lastName);
    await this.fillInput(this.addressInput,     details.address);
    await this.fillInput(this.cityInput,        details.city);
    await this.fillInput(this.stateInput,       details.state);
    await this.fillInput(this.zipCodeInput,     details.zipCode);
    await this.fillInput(this.phoneNumberInput, details.phoneNumber);
    await this.fillInput(this.ssnInput,         details.ssn);
    await this.fillInput(this.usernameInput,    details.username);
    await this.fillInput(this.passwordInput,    details.password);
    await this.fillInput(this.confirmPassInput, details.confirmPassword);
  }

  async submitRegistration(): Promise<void> {
    await this.clickElement(this.registerButton);
  }

  async getSuccessTitle(): Promise<string> {
    return await this.getText(this.successTitle);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successTitle);
  }

  // Expose navigateTo publicly for tests that pass a custom URL
  async navigateTo(url: string): Promise<void> {
    await super.navigateTo(url);
  }
}
