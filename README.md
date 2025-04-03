# Payin App

The **Payin App** is a modern, responsive hosted payment page application built using Next.js, TypeScript, and Tailwind CSS. This project demonstrates best practices in building interactive, component-based web applications with efficient state management and API integration.

The application simulates a complete payment journey using a sandbox API provided via Postman. It includes an Accept Quote page, a Pay Quote page, and an Expiry page, and implements auto-refresh, currency selection, and copy-to-clipboard functionality.

---

## How to Pull and Run the Repository

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/)
- A code editor (recommended: [Visual Studio Code](https://code.visualstudio.com/) or [Cursor](https://cursor.so/))

### Steps

1. **Clone the Repository**

   You will be invited as a contributor. To clone the repository, open your terminal and run:

   ```bash
   git clone https://github.com/wkapenda/payin-app.git
   cd payin-app

   ```

2. **Install Dependencies**

   In the project root directory, run:

   ```bash
   npm install

   ```

3. **Run the Application**

   Start the development server by running:

   ```bash
   npm run dev

   ```

   The app will run on http://localhost:3000. Open this URL in your browser to view the application.

## Running Tests and Generating Coverage

This project uses Jest along with React Testing Library for unit and integration testing.

**Running Tests**

To run the tests, execute the following command in the project root:

```bash
npm run test

```

This command will run all test suites and display the results in the terminal.

**Generating Test Coverage**

To generate a test coverage report, use the following command:

```bash
npm run coverage

```

The coverage command will produce a detailed report in your terminal and create a coverage folder in the project root. You can open the HTML report (usually located at coverage/lcov-report/index.html) in your browser for a detailed view of the test coverage.

## Assumptions

- **API Failures:**  
  It is assumed that any API call failure is due to payment expiry. This assumption guides the error handling and redirection logic throughout the application.

## Issues

- **Quote Update Timeout:**  
  There is an issue where the quote update API fails to refresh the quote after the initial 30-second countdown, resulting in a timeout. Consequently, if the user clicks the confirm payment button when the quote has not been updated, the acceptance API call fails because the payment is considered expired. Further investigation is needed to resolve this behavior.
