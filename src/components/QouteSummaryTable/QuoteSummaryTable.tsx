"use client";

import React from "react";
import LabelledValue from "@/components/LabelledValue/LabelledValue"; // Adjust path as needed
import "./QuoteSummaryTable.scss";

// Example static data; you can also pass this in as props.
const tableRows = [
  { description: "Invoice", value: "INV001" },
  { description: "Status", value: "Paid" },
  { description: "Method", value: "Credit Card" },
  { description: "Amount", value: "$250.00" },
];

const QuoteSummaryTable: React.FC = () => {
  return (
    <div className="quote-summary-table">
      {tableRows.map((row, index) => (
        <div key={index} className="quote-summary-table__row">
          <LabelledValue description={row.description} value={row.value} />
        </div>
      ))}
    </div>
  );
};

export default QuoteSummaryTable;
