# ParaBank Demo Test Automation

A comprehensive **Playwright-based test automation framework** using the Page Object Model (POM) pattern with full TypeScript support for testing the ParaBank application. This framework provides production-grade automation capabilities with modern testing practices.

## 🚀 Key Features

### Core Testing Framework
- **Playwright**: End-to-end testing across Chromium, Firefox, and WebKit browsers
- **Page Object Model (POM)**: Maintainable and scalable test structure with page object patterns
- **TypeScript**: Full type safety with interfaces and strict type checking
- **Global Setup**: Automated user registration before test execution
- **Parallel Execution**: 4 concurrent workers for optimized test performance

### Advanced Testing Capabilities
- **Multi-Browser Support**: Seamless testing across Chrome, Firefox, and Safari
- **Smart Retries**: Automatic retry mechanism for flaky tests (2 retries in CI, 1 locally)
- **Comprehensive Reporting**: HTML, JSON, and list reporters with detailed test results
- **Visual Debugging**: Screenshots on failure and video retention for failed tests
- **Trace Recording**: Playwright traces for debugging on first retry
- **Timeout Handling**: Configurable action (15s) and navigation (30s) timeouts for slow sites

### Test Data Management
- **Type-Safe Test Data**: Interface-driven test data validation via `ITestData`
- **Structured Test Data**: JSON-based test data files with full type safety
- **Registration Details**: Automated handling of registration information
- **User Credentials**: Secure management of test user credentials

### Performance & Reliability
- **Parallel Test Execution**: Run tests concurrently for faster feedback
- **Flaky Test Handling**: Automatic retries for unreliable tests
- **Network Tolerance**: Extended timeouts to handle slow network conditions
- **Cross-Browser Validation**: Ensure consistency across all supported browsers

## 🛠 Technologies Used

| Technology | Version | Purpose |
|---|---|---|
| **Playwright** | ^1.58.2 | End-to-end testing framework |
| **TypeScript** | ^5.9.3 | Type-safe test code |
| **Node.js** | Latest | Runtime environment |
| **@types/node** | ^20.19.37 | Node.js type definitions |

## 📁 Project Structure

```
parabankdemo/
├── tests/                          # Test specifications and test cases
├── pages/                          # Page Object Models for UI components
├── interfaces/                     # TypeScript interfaces (e.g., ITestData)
├── data/                          # Test data files (testData.json)
├── scripts/                       # Utility and helper scripts
├── reports/                       # Generated test reports (HTML, JSON)
├── playwright.config.ts           # Playwright configuration
├── global-setup.ts               # Global setup for test initialization
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── ParaBank_TestCases.txt        # Test case documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- Git for version control
- Access to ParaBank application: `https://parabank.parasoft.com`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jibinjoy77398/parabankdemo.git
   cd parabankdemo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This installs:
   - Playwright test framework
   - TypeScript compiler
   - Node.js type definitions
   - All required browsers (Chromium, Firefox, WebKit)

3. **Verify installation:**
   ```bash
   npx playwright --version
   ```

## 📋 Running Tests

### Basic Test Execution

**Run all tests (headless mode):**
```bash
npm test
# or
npx playwright test
```

**Run tests with UI mode (interactive):**
```bash
npm run test:ui
```

**Run tests in headed mode (visible browser):**
```bash
npm run test:headed
```

### Advanced Test Execution

**Run specific test file:**
```bash
npx playwright test tests/login.spec.ts
```

**Run tests matching a pattern:**
```bash
npx playwright test --grep @smoke
```

**Run tests in specific browser:**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Run tests with debug mode:**
```bash
npx playwright test --debug
```

**Generate trace for debugging:**
```bash
npx playwright test --trace on
```

## 📊 Test Reports

After test execution, multiple reports are automatically generated:

### HTML Report
```bash
npx playwright show-report
```
- Interactive HTML dashboard with detailed test results
- Screenshot and video attachments
- Flaky test analysis

### JSON Report
```bash
# Generated as test-results.json
cat test-results.json
```
- Machine-readable format for CI/CD integration
- Detailed test metrics and timings

### Console Report
```bash
# Displayed automatically during test run
# Shows pass/fail status for each test
```

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)

Key configurations:
- **Base URL**: `https://parabank.parasoft.com`
- **Timeout**: 15s per action, 30s for navigation
- **Retries**: 2 in CI environment, 1 locally
- **Workers**: 4 parallel workers
- **Screenshot**: Only on failure
- **Video**: Retained on failure
- **Trace**: Recorded on first retry

### Test Data Configuration (`global-setup.ts`)

The global setup automatically:
1. Reads test data from `data/testData.json`
2. Registers a new test user before tests run
3. Handles existing user accounts gracefully
4. Provides credentials for test execution

### Custom Configuration

To modify configurations:
1. Edit `playwright.config.ts` for test execution settings
2. Edit `global-setup.ts` for setup behavior
3. Update `data/testData.json` for test data
4. Create page objects in `pages/` directory
5. Add TypeScript interfaces in `interfaces/` directory

## 📝 Page Object Model Structure

Example page object:

```typescript
// pages/LoginPage.ts
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('https://parabank.parasoft.com');
  }

  async login(username: string, password: string) {
    await this.page.fill('[name="username"]', username);
    await this.page.fill('[name="password"]', password);
    await this.page.click('[value="Log In"]');
  }
}
```

## ✨ Best Practices

### Test Organization
- Organize tests by feature or module
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

### Maintainability
- Use Page Object Models for all UI interactions
- Centralize selectors in page objects
- Avoid hardcoded wait times (use Playwright auto-waiting)

### Reliability
- Use proper waits instead of sleep
- Handle dynamic elements gracefully
- Implement retry logic for flaky operations

### Performance
- Leverage parallel execution
- Use appropriate timeout values
- Clean up test data after execution

## 🐛 Troubleshooting

### Tests Not Running
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npx playwright install
```

### Timeout Issues
- Increase timeout values in `playwright.config.ts`
- Check network connectivity
- Verify ParaBank application is accessible

### Registration Failures
- Verify test data in `data/testData.json`
- Check user doesn't already exist
- Review global setup logs for details

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ParaBank Application](https://parabank.parasoft.com/)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Make your changes and commit (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request with a clear description

### Guidelines
- Follow existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/jibinjoy77398/parabankdemo/issues)
- Submit a [Pull Request](https://github.com/jibinjoy77398/parabankdemo/pulls)
- Contact the maintainers

---

**Last Updated**: 2026-03-18 07:12:55

Built with ❤️ using Playwright & TypeScript