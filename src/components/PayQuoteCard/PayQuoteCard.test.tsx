import { render, screen, waitFor } from "@testing-library/react";
import PayQuoteCard from "@/components/PayQuoteCard/PayQuoteCard";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import React from "react";
import { useRouter } from "next/navigation";

// Mock Next.js navigation hooks.
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const pushMock = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: pushMock });

const dummyQuote = {
  uuid: "dummy-uuid",
  merchantDisplayName: "Business Account",
  merchantId: "merchant-id",
  dateCreated: Date.now(),
  expiryDate: Date.now() + 60000, // expires in 60 seconds
  quoteExpiryDate: null,
  acceptanceExpiryDate: Date.now() + 30000, // acceptance expiry in 30 seconds
  quoteStatus: "PENDING", // default status is PENDING
  reference: "dummy-reference",
  type: "IN",
  subType: "merchantPayIn",
  status: "PENDING",
  displayCurrency: { currency: "ZAR", amount: 200, actual: 0 },
  walletCurrency: { currency: "ZAR", amount: 200, actual: 0 },
  paidCurrency: { currency: "BTC", amount: 0.001, actual: 0.001 },
  feeCurrency: { currency: "ZAR", amount: 0, actual: 0 },
  networkFeeCurrency: { currency: null, amount: 0, actual: 0 },
  displayRate: { base: "BTC", counter: "ZAR", rate: 50000 },
  exchangeRate: { base: "BTC", counter: "ZAR", rate: 50000 },
  address: { address: "dummy-btc-address" },
  returnUrl: "",
  redirectUrl: `https://pay.sandbox.bvnk.com/payin/dummy-uuid`,
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

const renderComponent = (quoteProps = dummyQuote) =>
  render(
    <Provider store={store}>
      <PayQuoteCard quote={quoteProps} />
    </Provider>
  );

describe("PayQuoteCard Component", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  test("renders heading with proper currency label", () => {
    renderComponent();
    // Assuming getCurrencyLabel returns "Bitcoin" for paidCurrency.currency "BTC"
    expect(screen.getByText(/Pay with Bitcoin/i)).toBeInTheDocument();
  });

  test("redirects to pay page when status is ACCEPTED", async () => {
    // Set status to ACCEPTED.
    const acceptedQuote = { ...dummyQuote, status: "ACCEPTED" };
    renderComponent(acceptedQuote);
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/payin/${acceptedQuote.uuid}/pay`);
    });
  });

  test("redirects to expired page when status is EXPIRED", async () => {
    // Set status to EXPIRED.
    const expiredQuote = { ...dummyQuote, status: "EXPIRED" };
    renderComponent(expiredQuote);
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        `/payin/${expiredQuote.uuid}/expired`
      );
    });
  });
});
