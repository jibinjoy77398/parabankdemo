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
    console.log(`\n[Global Setup] Registering user: ${username}`);
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
    await page.waitForTimeout(2000);

    const content = await page.content();
    if (content.includes('created successfully') || content.includes('Welcome')) {
      console.log(`[Global Setup] ✅ Registered: ${username}`);
    } else if (content.includes('already in use') || content.includes('already exists')) {
      console.log(`[Global Setup] ℹ️  User "${username}" already exists — skipping.`);
    } else {
      console.warn(`[Global Setup] ⚠️  Unexpected response — tests may use existing credentials.`);
    }
  } catch (e) {
    console.warn(`[Global Setup] ⚠️  Registration failed (${(e as Error).message}) — continuing with existing user.`);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
