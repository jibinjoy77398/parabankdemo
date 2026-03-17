import { ConsoleMessage, Request } from '@playwright/test';

/**
 * INTERFACE: IPage
 *
 * Defines the public contract that EVERY page object in the framework must fulfil.
 * While BasePage (abstract class) handles shared implementation, this interface
 * defines what is guaranteed to any code that holds a reference to *any* page object.
 */
export interface IPage {
  /** Navigate to this page's canonical URL */
  goto(): Promise<void>;

  /** The expected page title string (static, used for assertions) */
  getPageTitle(): string;

  /** Read the live .title text from the browser DOM */
  getActualPageTitle(): Promise<string>;

  /** Retrieves all console messages emitted by the page */
  getConsoleMessages(): Promise<ConsoleMessage[]>;

  /** Retrieves all uncaught exceptions/errors thrown within the page */
  getPageErrors(): Promise<Error[]>;

  /** Retrieves all network requests made by the page */
  getNetworkRequests(): Promise<Request[]>;
}
