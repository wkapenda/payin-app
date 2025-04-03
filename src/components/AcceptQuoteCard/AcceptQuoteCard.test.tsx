import { render, screen } from "@testing-library/react";
import AcceptQuoteCard from "@/components/AcceptQuoteCard/AcceptQuoteCard";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import React from "react";
import { useRouter } from "next/navigation";

// Mock Next.js router.
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: pushMock });

// Dummy initial quote matching the QuoteResponse interface.
const dummyInitialQuote = {
  uuid: "9e7f5a7d-7d8b-4ed0-bf40-0f333e19a82a",
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
  redirectUrl:
    "https://pay.sandbox.bvnk.com/payin/9e7f5a7d-7d8b-4ed0-bf40-0f333e19a82a",
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

const renderComponent = () =>
  render(
    <Provider store={store}>
      <AcceptQuoteCard quote={dummyInitialQuote} />
    </Provider>
  );

describe("AcceptQuoteCard Component", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  test("renders with initial quote data", () => {
    renderComponent();
    expect(screen.getByText("Business Account")).toBeInTheDocument();
    expect(screen.getByText(/test_reference_in_nv70Dt/i)).toBeInTheDocument();
  });
});
