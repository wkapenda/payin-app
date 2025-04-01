import { AcceptQuoteRequest } from "@/types/api.types";
import { iLabelValue, QuoteEntry } from "@/types/QuoteSummay.types";

export const currencyOptions: iLabelValue[] = [
  { label: "Bitcoin", value: "BTC" },
  { label: "Ethereum", value: "ETH" },
  { label: "Litecoin", value: "LTC" },
];

export const defaultQuoteValues: QuoteEntry[] = [
  { description: "Amount due", value: "" },
  { description: "Quoted price expires in", value: "" },
];

export const defaultPayQuoteValues: QuoteEntry[] = [
  { description: "Amount due", value: "" },
  { description: "BTC address", value: "" },
  { description: "Time left to pay", value: "" },
];

export const acceptQuotePayload: AcceptQuoteRequest = { successUrl: "no_url" };
