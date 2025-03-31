export interface QuoteData {
  uuid: string;
  merchantDisplayName: string;
  displayCurrency: {
    currency: string;
    amount: number;
  };
}
