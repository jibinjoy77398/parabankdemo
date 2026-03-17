/**
 * INTERFACE: IPage
 *
 * Defines the public contract that EVERY page object in the framework must fulfil.
 * While BasePage (abstract class) handles shared implementation, this interface
 * defines what is guaranteed to any code that holds a reference to *any* page object.
 *
 * This enables writing framework-level helpers that accept any IPage:
 *
 *   async function verifyPageTitle(page: IPage) {
 *     const actual = await page.getActualPageTitle();
 *     expect(actual).toBe(page.getPageTitle());
 *   }
 *
 * Both LoginPage and RegisterPage pass this check automatically.
 */
export interface IPage {
  /** Navigate to this page's canonical URL */
  goto(): Promise<void>;

  /** The expected page title string (static, used for assertions) */
  getPageTitle(): string;

  /** Read the live .title text from the browser DOM */
  getActualPageTitle(): Promise<string>;
}
