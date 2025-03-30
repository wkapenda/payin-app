"use client";

import React, { useState } from "react";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import { currencyOptions } from "@/constants/currencies";
// import LabelledValue from "../LabelledValue/LabelledValue";
import QuoteSummaryTable from "../QouteSummaryTable/QuoteSummaryTable";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

const AcceptQuoteCard = () => {
  const handleCurrencyChange = (value: string) => {
    console.log("Selected currency:", value);
  };

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
      <h3 className="heading font-medium m-[4px]">Merchant Display Name</h3>
      <h2 className="currency-value font-semibold">
        200 <span className="currency">EUR</span>
      </h2>
      <p className="value-label my-[25px]">
        For the reference number:{" "}
        <span className="value font-medium">1234567890</span>
      </p>
      <Dropdown
        label="Pay with"
        placeholder="Select currency"
        options={currencyOptions}
        onChange={handleCurrencyChange}
      />
      {/* <LabelledValue description="Amount due" value="0.00410775 BTC" /> */}

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

export default AcceptQuoteCard;
