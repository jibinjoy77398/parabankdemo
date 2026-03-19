import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ITestData } from './interfaces/ITestData';

async function globalSetup() {
  // ITestData interface gives full type safety when reading testData.json
  const dataFilePath = path.join(__dirname, 'data', 'testData.json');
  const testData: ITestData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  const { username, password } = testData.validUser;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log(`\n[Global Setup] Authentication & State Preservation: ${username}`);
    await page.goto('https://parabank.parasoft.com/parabank/register.htm', { timeout: 30000 });

    const reg = testData.registrationDetails;
    await page.locator('[id="customer.firstName"]').fill(reg.firstName);
    await page.locator('[id="customer.lastName"]').fill(reg.lastName);
    await page.locator('[id="customer.address.street"]').fill(reg.address);
    await page.locator('[id="customer.address.city"]').fill(reg.city);
    await page.locator('[id="customer.address.state"]').fill(reg.state);
    await page.locator('[id="customer.address.zipCode"]').fill(reg.zipCode);
    await page.locator('[id="customer.phoneNumber"]').fill(reg.phoneNumber);
    await page.locator('[id="customer.ssn"]').fill(reg.ssn);
    await page.locator('[id="customer.username"]').fill(username);
    await page.locator('[id="customer.password"]').fill(password);
    await page.locator('#repeatedPassword').fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
    
    // Wait for the welcome message or if user already exists error
    await page.waitForLoadState('networkidle');
    const content = await page.content();

    if (content.includes('Your account was created successfully')) {
      console.log(`[Global Setup] ✅ User "${username}" registered successfully.`);
    } else if (content.includes('This username already exists')) {
      console.log(`[Global Setup] ℹ️  User "${username}" already exists. Proceeding to Login.`);
      // If user exists, we need to explicitly login to capture session
      await page.goto('https://parabank.parasoft.com/parabank/index.htm');
      await page.locator('input[name="username"]').fill(username);
      await page.locator('input[name="password"]').fill(password);
      await page.locator('input[value="Log In"]').click();
      await page.waitForLoadState('networkidle');
    }

    // Save storage state to a file
    await page.context().storageState({ path: 'state.json' });
    console.log(`[Global Setup] 💾 Storage state saved to "state.json"`);

  } catch (e) {
    console.error(`[Global Setup] ❌ Error establishing global state: ${(e as Error).message}`);
    throw e;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
