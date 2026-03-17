import { Page } from '@playwright/test';
import { IPage } from '../interfaces/IPage';

/**
 * OOP CONCEPT 1: ABSTRACTION — abstract class hiding Playwright internals
 * OOP CONCEPT 2: ENCAPSULATION — protected page; protected helper methods
 *
 * BasePage also IMPLEMENTS IPage interface — it commits to providing
 * goto(), getPageTitle(), and getActualPageTitle() to any consumer of the framework.
 */
export abstract class BasePage implements IPage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Abstract method (forces every subclass to declare its page title) ──────
  abstract getPageTitle(): string;

  // ── Abstract goto (forces every subclass to declare its canonical URL) ─────
  abstract goto(): Promise<void>;

  // ── Concrete: shared across all pages ─────────────────────────────────────
  async getActualPageTitle(): Promise<string> {
    return await this.getText('.title');
  }

  // ── Protected helpers (Encapsulation) ─────────────────────────────────────
  protected async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  protected async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  protected async fillInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  protected async getText(selector: string): Promise<string> {
    return await this.page.innerText(selector);
  }

  protected async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  protected async waitForUrl(pattern: string, timeout = 10000): Promise<void> {
    await this.page.waitForURL(pattern, { timeout });
  }

  /**
   * Click with intermediate mousemove events.
   * Use `steps > 1` for hover-triggered menus or elements that
   * respond to mouse-path (default Playwright click = 1 step / instant).
   *
   * @param selector  CSS / Playwright locator string
   * @param steps     Number of mousemove events emitted (default: 1)
   */
  protected async clickWithSteps(selector: string, steps = 1): Promise<void> {
    await this.page.locator(selector).click({ steps });
  }

  /**
   * Drag one element to another with intermediate mousemove events.
   * Higher `steps` = smoother drag, needed for canvas / sortable lists
   * that track the mouse path rather than just start & end positions.
   *
   * @param sourceSelector  Element to drag from
   * @param targetSelector  Element to drag onto
   * @param steps           Number of mousemove events emitted (default: 20)
   */
  protected async dragTo(
    sourceSelector: string,
    targetSelector: string,
    steps = 20
  ): Promise<void> {
    await this.page.locator(sourceSelector).dragTo(
      this.page.locator(targetSelector),
      { steps }
    );
  }

  // ── Advanced Inspection Helpers (Playwright 1.50+) ────────────────────────

  /**
   * Retrieves all console messages (logs, warnings, errors) emitted by the page
   * during this test execution.
   */
  async getConsoleMessages() {
    return this.page.consoleMessages();
  }

  /**
   * Retrieves all uncaught exceptions/errors thrown within the page context
   * during this test execution.
   */
  async getPageErrors() {
    return this.page.pageErrors();
  }

  /**
   * Retrieves all network requests made by the page during this test execution.
   * Useful for asserting API calls were made correctly.
   */
  async getNetworkRequests() {
    return this.page.requests();
  }
}
