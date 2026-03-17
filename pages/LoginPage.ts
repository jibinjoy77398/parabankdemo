import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { IUserCredentials } from '../interfaces/IUserCredentials';

/**
 * OOP: Inheritance (extends BasePage), Polymorphism (overrides getPageTitle, goto)
 * INTERFACE: login() accepts IUserCredentials for type-safe credential passing
 */
export class LoginPage extends BasePage {
  // ── Private locators (Encapsulation) ──────────────────────────────────────
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly loginButton   = 'input[value="Log In"]';
  private readonly errorMessage  = '.error';

  constructor(page: Page) {
    super(page);
  }

  // ── IPage contract implementation ──────────────────────────────────────────
  getPageTitle(): string {
    return 'Customer Login';
  }

  async goto(): Promise<void> {
    await this.navigateTo('https://parabank.parasoft.com/parabank/index.htm');
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Accept credential object (IUserCredentials) OR separate strings */
  async loginWith(credentials: IUserCredentials): Promise<void> {
    await this.fillInput(this.usernameInput, credentials.username);
    await this.fillInput(this.passwordInput, credentials.password);
    await this.clickElement(this.loginButton);
  }

  /** Convenience overload — keeps backward compatibility with (string, string) calls */
  async login(username: string, password: string): Promise<void> {
    await this.loginWith({ username, password });
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  // Expose navigateTo publicly for tests that navigate directly
  async navigateTo(url: string): Promise<void> {
    await super.navigateTo(url);
  }
}
