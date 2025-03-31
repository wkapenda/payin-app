export interface QuoteEntry {
  description: string;
  value: string;
}

export interface QuoteSummaryTableProps {
  entries: QuoteEntry[];
}
