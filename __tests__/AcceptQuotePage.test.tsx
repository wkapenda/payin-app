import { render, screen, waitFor } from "@testing-library/react";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import React from "react";
import * as api from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import AcceptQuotePage from "@/app/payin/[uuid]/page";

// Mock Next.js navigation hooks.
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

const dummyUuid = "9e7f5a7d-7d8b-4ed0-bf40-0f333e19a82a";

// Dummy quote that matches your QuoteResponse interface.
const dummyQuote = {
  uuid: dummyUuid,
  merchantDisplayName: "Business Account",
  merchantId: "fb140b88-7296-4397-bd9e-47b29a4805ee",
  dateCreated: Date.now(),
  expiryDate: Date.now() + 60000, // 60 seconds later
  quoteExpiryDate: null,
  acceptanceExpiryDate: Date.now() + 30000, // 30 seconds later
  quoteStatus: "TEMPLATE",
  reference: "test_reference_in_nv70Dt",
  type: "IN",
  subType: "merchantPayIn",
  status: "PENDING",
  displayCurrency: { currency: "ZAR", amount: 200, actual: 0 },
  walletCurrency: { currency: "ZAR", amount: 200, actual: 0 },
  paidCurrency: { currency: null, amount: 0, actual: 0 },
  feeCurrency: { currency: "ZAR", amount: 0, actual: 0 },
  networkFeeCurrency: { currency: null, amount: 0, actual: 0 },
  displayRate: null,
  exchangeRate: null,
  address: { address: "" },
  returnUrl: "",
  redirectUrl: `https://pay.sandbox.bvnk.com/payin/${dummyUuid}`,
  transactions: [],
  refund: null,
  refunds: [],
  currencyOptions: [],
  flow: "DEFAULT",
  twoStep: false,
  customerId: "123",
  networkFeeBilledTo: "MERCHANT",
  networkFeeRates: [],
};

// Setup our mocks.
beforeEach(() => {
  // Mock useParams to return our dummy UUID.
  (useParams as jest.Mock).mockReturnValue({ uuid: dummyUuid });
  // Mock useRouter to provide a dummy push function.
  (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  // Clear any previous API mocks.
  jest.clearAllMocks();
});

// Helper to render the component with Redux Provider.
const renderComponent = () =>
  render(
    <Provider store={store}>
      <AcceptQuotePage />
    </Provider>
  );

describe("AcceptQuotePage Component", () => {
  test("renders Loader while fetching quote", () => {
    // Simulate fetchQuoteSummary never resolving (so Loader remains).
    jest.spyOn(api, "fetchQuoteSummary").mockReturnValue(new Promise(() => {}));
    renderComponent();
    // For Loader, we'll check for an element with class "animate-spin"
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  test("renders error message when fetchQuoteSummary fails", async () => {
    jest
      .spyOn(api, "fetchQuoteSummary")
      .mockRejectedValue(new Error("Failed to fetch quote summary"));
    renderComponent();
    await waitFor(() => {
      expect(
        screen.getByText(/error: failed to fetch quote summary/i)
      ).toBeInTheDocument();
    });
  });

  test("renders AcceptQuoteCard when quote is fetched successfully", async () => {
    jest.spyOn(api, "fetchQuoteSummary").mockResolvedValue(dummyQuote);
    renderComponent();
    await waitFor(() => {
      // Check for merchant display name in the AcceptQuoteCard
      expect(screen.getByText("Business Account")).toBeInTheDocument();
    });
  });
});
