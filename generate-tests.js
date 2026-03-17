const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'ParaBank_TestCases.txt');

const content = fs.readFileSync(inputFile, 'utf-8');

const tests = [];
let currentTest = null;

const lines = content.split('\n');

for (const line of lines) {
  const t = line.trim();
  if (t.startsWith('TC ID')) {
    if (currentTest) tests.push(currentTest);
    currentTest = { id: t.split(':')[1].trim() };
  } else if (currentTest) {
    if (t.startsWith('Module')) currentTest.module = t.split(':')[1].trim();
    else if (t.startsWith('Test Case Title')) currentTest.title = t.split(':')[1].trim();
    else if (t.startsWith('Type')) currentTest.type = t.split(':')[1].trim();
  }
}
if (currentTest) tests.push(currentTest);

console.log(`Parsed ${tests.length} tests.`);

// Group by module
const byModule = {};
for (const test of tests) {
  if (!byModule[test.module]) byModule[test.module] = [];
  byModule[test.module].push(test);
}

// Generate a single file with all tests running in one session (serial or parallel depending on context, we'll just put them in one file)
let output = `import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import testData from '../data/testData.json';

// Run tests in a single browser session context conceptually, by reusing state, or just running in same file
test.describe.configure({ mode: 'serial' });

let page;
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});
test.afterAll(async () => {
  await page.close();
});

test.describe('ParaBank Test Suite from Document', () => {

`;

for (const module of Object.keys(byModule)) {
  output += `  test.describe('${module}', () => {\n`;
  for (const t of byModule[module]) {
    // Generate an independent test shell for each
    output += `    test('${t.id} - ${t.title.replace(/'/g, "\\'")}', async () => {\n`;
    output += `       // TODO: Implement steps for ${t.id}\n`;
    output += `       // Type: ${t.type}\n`;
    output += `    });\n\n`;
  }
  output += `  });\n\n`;
}

output += `});\n`;

const outPath = path.join(__dirname, 'tests', 'parabank-all.spec.ts');
if (!fs.existsSync(path.join(__dirname, 'tests'))) fs.mkdirSync(path.join(__dirname, 'tests'));
fs.writeFileSync(outPath, output);
console.log('Generated tests/parabank-all.spec.ts');
