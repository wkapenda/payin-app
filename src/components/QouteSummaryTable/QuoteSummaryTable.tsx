"use client";

import React from "react";
import LabelledValue from "@/components/LabelledValue/LabelledValue";
import "./QuoteSummaryTable.scss";
import { QuoteSummaryTableProps } from "@/types/QuoteSummay.types";
import Image from "next/image";

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
              isCopy={entry.isCopy}
              isQuoteGenerated={isQuoteGenerated}
            />
            <div className="image flex justify-center items-center">
              {entry.qrCodeUrl && (
                <div className="image__qrcode flex flex-col items-center mt-[25px]">
                  <Image
                    src={entry.qrCodeUrl}
                    alt="QR Code"
                    width={150}
                    height={150}
                  />
                  <p className="image__value text-center mt-[12px]">
                    {entry.value}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuoteSummaryTable;
