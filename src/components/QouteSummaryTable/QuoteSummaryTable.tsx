"use client";

import React from "react";
import LabelledValue from "@/components/LabelledValue/LabelledValue";
import "./QuoteSummaryTable.scss";
import { QuoteSummaryTableProps } from "@/types/QuoteSummay.types";

const QuoteSummaryTable: React.FC<QuoteSummaryTableProps> = ({
  entries,
  isQuoteGenerated,
}) => {
  return (
    <div className="quote-summary-table">
      {entries.map((entry) => {
        const key = `${entry.description}-${entry.value}`;
        return (
          <div key={key} className="quote-summary-table__row">
            <LabelledValue
              description={entry.description}
              value={entry.value}
              isQuoteGenerated={isQuoteGenerated}
            />
          </div>
        );
      })}
    </div>
  );
};

export default QuoteSummaryTable;
