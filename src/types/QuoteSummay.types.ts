export interface QuoteEntry {
  description: string;
  value: string;
}

export interface QuoteSummaryTableProps {
  entries: QuoteEntry[];
  isQuoteGenerated?: boolean;
}

export interface iLabelValue {
  label: string;
  value: string;
}
