"use client";

import React, { useState } from "react";
import Card from "../Card/Card";
import QuoteSummaryTable from "../QouteSummaryTable/QuoteSummaryTable";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

const PayQuoteCard = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // Simulate an async action (e.g., an API call)
    setTimeout(() => {
      setLoading(false);
      console.log("Button clicked!");
    }, 2000);
  };

  return (
    <Card>
      <h3 className="heading font-medium m-[4px]">Pay with Bitcoin</h3>
      <p className="value-label text-center my-[25px]">
        To complete this payment send the amount due to the BTC address provided
        below.
      </p>

      <div className="quote-summary-container w-full my-[25]">
        <QuoteSummaryTable />
      </div>
      <div className="btn-container w-full">
        <PrimaryButton
          label="Confirm"
          loading={loading}
          onClick={handleClick}
        />
      </div>
    </Card>
  );
};

export default PayQuoteCard;
