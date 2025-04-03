import {
  fetchQuoteSummary,
  updateQuoteSummary,
  acceptQuote,
} from "@/services/api";
import {
  QuoteResponse,
  UpdateQuoteRequest,
  UpdateQuoteResponse,
  AcceptQuoteRequest,
} from "@/types/api.types";

describe("API functions", () => {
  const dummyUuid = "dummy-uuid";
  const dummyQuoteResponse: QuoteResponse = {
    uuid: dummyUuid,
    merchantDisplayName: "Test Merchant",
    merchantId: "test-merchant-id",
    dateCreated: Date.now(),
    expiryDate: Date.now() + 60000,
    quoteExpiryDate: Date.now() + 60000,
    acceptanceExpiryDate: Date.now() + 30000,
    quoteStatus: "PENDING",
    reference: "TEST-REF",
    type: "IN",
    subType: "merchantPayIn",
    status: "PENDING",
    displayCurrency: { currency: "USD", amount: 100, actual: 100 },
    walletCurrency: { currency: "USD", amount: 100, actual: 100 },
    paidCurrency: { currency: "BTC", amount: 0.001, actual: 0.001 },
    feeCurrency: { currency: "USD", amount: 1, actual: 1 },
    networkFeeCurrency: { currency: null, amount: 0, actual: 0 },
    // Provide valid Rate objects for displayRate and exchangeRate.
    displayRate: { base: "BTC", counter: "USD", rate: 50000 },
    exchangeRate: { base: "BTC", counter: "USD", rate: 50000 },
    address: { address: "dummy-address" },
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

  const dummyUpdatePayload: UpdateQuoteRequest = {
    currency: "BTC",
    payInMethod: "crypto",
  };

  const dummyUpdateResponse: UpdateQuoteResponse = {
    ...dummyQuoteResponse,
    acceptanceExpiryDate: Date.now() + 30000,
    quoteExpiryDate: Date.now() + 60000,
    // Explicitly providing valid Rate objects:
    displayRate: { base: "BTC", counter: "USD", rate: 50000 },
    exchangeRate: { base: "BTC", counter: "USD", rate: 50000 },
  };

  const dummyAcceptPayload: AcceptQuoteRequest = { successUrl: "no_url" };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("fetchQuoteSummary", () => {
    it("returns JSON when response is ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => dummyQuoteResponse,
        statusText: "OK",
      });
      const result = await fetchQuoteSummary(dummyUuid);
      expect(result).toEqual(dummyQuoteResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.sandbox.bvnk.com/api/v1/pay/${dummyUuid}/summary`
      );
    });

    it("throws an error when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: "Not Found",
      });
      await expect(fetchQuoteSummary(dummyUuid)).rejects.toThrow(
        "Failed to fetch quote summary: Not Found"
      );
    });
  });

  describe("updateQuoteSummary", () => {
    it("returns JSON when response is ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => dummyUpdateResponse,
        statusText: "OK",
      });
      const result = await updateQuoteSummary(dummyUuid, dummyUpdatePayload);
      expect(result).toEqual(dummyUpdateResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.sandbox.bvnk.com/api/v1/pay/${dummyUuid}/update/summary`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dummyUpdatePayload),
        }
      );
    });

    it("throws an error when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: "Bad Request",
      });
      await expect(
        updateQuoteSummary(dummyUuid, dummyUpdatePayload)
      ).rejects.toThrow("Failed to update quote summary: Bad Request");
    });
  });

  describe("acceptQuote", () => {
    it("returns JSON when response is ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => dummyAcceptPayload,
        statusText: "OK",
      });
      const result = await acceptQuote(dummyUuid, dummyAcceptPayload);
      expect(result).toEqual(dummyAcceptPayload);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.sandbox.bvnk.com/api/v1/pay/${dummyUuid}/accept/summary`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dummyAcceptPayload),
        }
      );
    });

    it("throws an error when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: "Unauthorized",
      });
      await expect(acceptQuote(dummyUuid, dummyAcceptPayload)).rejects.toThrow(
        "Failed to accept quote: Unauthorized"
      );
    });
  });
});
