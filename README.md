# Payin App

The **Payin App** is a modern, responsive hosted payment page application built with Next.js and TypeScript. This application demonstrates best practices in building interactive user interfaces, efficient state management, API integration, and component-based architecture. It is integrated with a sandbox API (via Postman) to simulate a complete payment flow.

## Overview

The app implements the following payment journey:

### Accept Quote Page

- **Initial Load:**  
   When the Accept Quote page loads, the app retrieves the quote details via a GET request to:
  GET https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/summary

The response contains key data such as:

- Merchant details (e.g. `merchantDisplayName`)
- Payment amounts (from `displayCurrency` and `paidCurrency`)
- Expiry dates (e.g. `expiryDate` and `acceptanceExpiryDate`)
- Reference number and status

- **Currency Selection:**  
  Users select their preferred cryptocurrency (Bitcoin, Ethereum, or Litecoin) from a dropdown. This triggers a PUT request to update the quote:
  PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/update/summary

**Payload:**

```
{
  "currency": "BTC",  // or "ETH", "LTC" depending on selection
  "payInMethod": "crypto"
}
On success, the UI displays:

The updated "Amount due" (from paidCurrency.amount and paidCurrency.currency)

A refreshed acceptance timer (based on acceptanceExpiryDate)

Auto-Refresh:
If the customer does not click Confirm before the acceptance timer expires, the app automatically calls the update API (using the same payload as above) to refresh the quote details.
If an API call fails (assumed to be due to an expired payment token), the user is redirected to the Expiry page.

Confirm:
When the customer clicks the Confirm button, the app sends a final PUT request to accept the quote:



PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/accept/summary
Payload:



{
  "successUrl": "no_url"
}
On a successful response (HTTP 200), the customer is redirected to the Pay Quote page.

Pay Quote Page
On Load:
The app fetches the updated quote details via:



GET https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/summary
This response includes:

Amount due (from paidCurrency)

Crypto Address (from address.address)

Expiry Date (used for a countdown timer)

Display:
The page displays:

The amount due and crypto address

A QR code generated from the crypto address

A countdown timer showing the time left to pay (based on expiryDate)

-to-clipboard functionality for the amount due and crypto address

Redirects:

If the quote status changes to "ACCEPTED", the customer remains on the Pay Quote page.

If the payment window expires, the user is redirected to the Expiry page:


/payin/<UUID>/expired

Expiry Page
This page is displayed if the quote expires (or if any API call fails due to an expired token).

Setup
Prerequisites

Node.js (version 14 or later)
npm
A code editor (recommended: Visual Studio Code or Cursor)

Instructions
Clone the Repository

You will be invited as a contributor to the repository. To clone the repository, open your terminal and run:


git clone https://github.com/wkapenda/payin-app.git
cd payin-app
Install Dependencies

Install the project dependencies by running:



npm install
Run the Application

Start the development server:


npm run dev
The application will be available at http://localhost:3000.

How to Use the Application
Generate a Payment UUID

Open the provided Postman Collection (payments.postman_collection.json) and Environment (sandbox.postman_environment.json).

Ensure the "Create Payment In" request is set to use the Sandbox environment.

Click Send on the "Create Payment In" request to generate a new payment. The response will include a UUID.

Access the Accept Quote Page

In your browser, navigate to:



http://localhost:3000/payin/<UUID>

Replace <UUID> with the payment UUID generated in the previous step.

Accept Quote Flow

On the Accept Quote page, review the quote details (merchant name, amount due, reference).

Select your preferred currency from the Pay with dropdown. This triggers a PUT request to update the quote.

If the acceptance timer expires without confirmation, the app automatically refreshes the quote details.

Click the Confirm button to finalize the quote. This sends a final PUT request and, on success, redirects you to the Pay Quote page.

Pay Quote Page

On the Pay Quote page, the app fetches the updated quote details. These details include:

Amount due

Crypto Address (with copy-to-clipboard functionality)

QR Code (generated from the crypto address)

Time left to pay (countdown timer based on expiryDate)

If the payment window expires, the app redirects you to the Expiry page.

Expired Quote Handling

If any API call fails (due to the payment token expiring), you will be redirected to:


http://localhost:3000/payin/<UUID>/expired
This page informs you that the quote has expired.


Additional Information
API Endpoints:

Fetch Quote Summary (GET):


GET https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/summary
Update Quote Summary (PUT):


PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/update/summary
Payload Example:


{
  "currency": "BTC",
  "payInMethod": "crypto"
}

Refresh Quote Summary (PUT):
This endpoint is called automatically when the acceptance timer expires to refresh the quote.


PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/summary
(Uses the same payload as the update endpoint.)

Accept Quote (PUT):


PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/accept/summary
Payload Example:


{
  "successUrl": "no_url"
}
Assumptions:

The user will generate the UUID using the Postman sandbox.

If any API call fails, it is assumed that the payment token has expired, and the user is redirected to the Expiry page.

Styling:
The application uses Tailwind CSS for a modern, responsive design.

Conclusion
This repository provides a fully functional Hosted Payment Page as specified in the assessment scope. Please follow the steps above to set up and run the application. I have completed the work as specified and look forward to your feedback.
```
