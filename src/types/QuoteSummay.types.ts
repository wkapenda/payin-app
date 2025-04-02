export interface QuoteEntry {
  description: string;
  value: string;
  isCopy: boolean;
  qrCodeUrl?: string;
}

export interface QuoteSummaryTableProps {
  entries: QuoteEntry[];
  isQuoteGenerated?: boolean;
}

export interface iLabelValue {
  label: string;
  value: string;
}
