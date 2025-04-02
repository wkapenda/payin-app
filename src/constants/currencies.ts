import { AcceptQuoteRequest } from "@/types/api.types";
import { iLabelValue, QuoteEntry } from "@/types/QuoteSummay.types";

export const currencyOptions: iLabelValue[] = [
  { label: "Bitcoin", value: "BTC" },
  { label: "Ethereum", value: "ETH" },
  { label: "Litecoin", value: "LTC" },
];

export const defaultQuoteValues: QuoteEntry[] = [
  { description: "Amount due", value: "", isCopy: false },
  { description: "Quoted price expires in", value: "", isCopy: false },
];

export const defaultPayQuoteValues: QuoteEntry[] = [
  { description: "Amount due", value: "", isCopy: true },
  { description: "BTC address", value: "", isCopy: true, qrCodeUrl: "" },
  { description: "Time left to pay", value: "", isCopy: false },
];

export const acceptQuotePayload: AcceptQuoteRequest = { successUrl: "no_url" };
