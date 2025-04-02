export interface CurrencyAmount {
  currency: string | null;
  amount: number;
  actual: number;
}

export interface QuoteAddress {
  address: string;
  tag?: string | null;
  protocol?: string;
  uri?: string;
  alternatives?: unknown[];
}

export interface QuoteResponse {
  uuid: string;
  merchantDisplayName: string;
  merchantId: string;
  dateCreated: number;
  expiryDate: number;
  quoteExpiryDate: number | null;
  acceptanceExpiryDate: number | null;
  quoteStatus: string;
  reference: string;
  type: string;
  subType: string;
  status: string;
  displayCurrency: CurrencyAmount;
  walletCurrency: CurrencyAmount;
  paidCurrency: CurrencyAmount;
  feeCurrency: CurrencyAmount;
  networkFeeCurrency: CurrencyAmount;
  displayRate: unknown;
  exchangeRate: unknown;
  address: QuoteAddress;
  returnUrl: string;
  redirectUrl: string;
  transactions: unknown[];
  refund: unknown;
  refunds: unknown[];
  currencyOptions: unknown[];
  flow: string;
  twoStep: boolean;
  customerId: string;
  networkFeeBilledTo: string;
  networkFeeRates: unknown[];
}

export interface AcceptQuoteCardProps {
  quote: QuoteResponse;
}

export interface UpdateQuoteRequest {
  currency: string;
  payInMethod: string;
}

export interface AcceptQuoteRequest {
  successUrl: string;
}

export interface CurrencyAmount {
  currency: string | null;
  amount: number;
  actual: number;
}

export interface Rate {
  base: string;
  counter: string;
  rate: number;
}

export interface UpdateQuoteResponse {
  uuid: string;
  merchantDisplayName: string;
  merchantId: string;
  dateCreated: number;
  expiryDate: number;
  quoteExpiryDate: number;
  acceptanceExpiryDate: number;
  quoteStatus: string;
  reference: string;
  type: string;
  subType: string;
  status: string;
  displayCurrency: CurrencyAmount;
  walletCurrency: CurrencyAmount;
  paidCurrency: CurrencyAmount;
  feeCurrency: CurrencyAmount;
  networkFeeCurrency: CurrencyAmount;
  displayRate: Rate;
  exchangeRate: Rate;
  address: unknown;
  returnUrl: string;
  redirectUrl: string;
  transactions: unknown[];
  refund: unknown;
  refunds: unknown[];
  currencyOptions: unknown;
  flow: unknown;
  twoStep: boolean;
  customerId: string;
  networkFeeBilledTo: string;
  networkFeeRates: unknown[];
}
