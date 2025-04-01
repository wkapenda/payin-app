"use client";

import React, { useState } from "react";
import Card from "../Card/Card";
import QuoteSummaryTable from "../QouteSummaryTable/QuoteSummaryTable";
import { QuoteEntry } from "@/types/QuoteSummay.types";
import { defaultPayQuoteValues } from "@/constants/currencies";
import { AcceptQuoteCardProps, QuoteResponse } from "@/types/api.types";

const PayQuoteCard: React.FC<AcceptQuoteCardProps> = ({
  quote: initialQuote,
}) => {
  const [quoteData, setQuoteData] = useState<QuoteResponse>(initialQuote);
  const [tableEntries, setTableEntries] = useState<QuoteEntry[]>(
    defaultPayQuoteValues
  );

  return (
    <Card>
      <h3 className="heading font-medium m-[4px]">Pay with Bitcoin</h3>
      <p className="value-label text-center my-[25px]">
        To complete this payment send the amount due to the BTC address provided
        below.
      </p>

      <div className="quote-summary-container w-full my-[25]">
        <QuoteSummaryTable
          entries={tableEntries}
          isQuoteGenerated={isQuoteUpdateSuccessful}
        />
      </div>
    </Card>
  );
};

export default PayQuoteCard;
