# ParaBank Demo Test Automation

## Overview
The ParaBank demo test automation project is designed to provide a comprehensive suite of automated tests for the ParaBank application. Using Playwright and TypeScript, the project aims to ensure the reliability and efficiency of the application's features.

## Technologies Used
- **Playwright**: A powerful framework for end-to-end testing that allows for testing web applications across different browsers.
- **TypeScript**: A typed superset of JavaScript that provides static typing, making the code more robust and maintainable.

## Project Structure
- `tests/`: Contains all the test specifications.
- `pageObjects/`: Contains page object models that encapsulate the login and user interaction logic.
- `utils/`: Contains utility functions that aid in testing, such as test data generation.

## Getting Started
### Prerequisites
- Node.js installed in your system.
- Access to the ParaBank application endpoint.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/jibinjoy77398/parabankdemo
   cd parabankdemo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Tests
You can run tests using the following command:
```bash
npx playwright test
```

## Contribution
Feel free to submit issues or pull requests for improvements and enhancements to the test suite.

## License
This project is licensed under the MIT License. See the LICENSE file for more information.