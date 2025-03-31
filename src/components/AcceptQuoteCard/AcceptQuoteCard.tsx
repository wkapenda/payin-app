"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import { currencyOptions } from "@/constants/currencies";
import QuoteSummaryTable from "../QouteSummaryTable/QuoteSummaryTable";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import {
  AcceptQuoteCardProps,
  QuoteResponse,
  UpdateQuoteRequest,
} from "@/types/api.types";
import { updateQuoteSummary } from "@/services/api";
import { QuoteEntry } from "@/types/QuoteSummay.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrency } from "@/store/currencySlice";

const AcceptQuoteCard: React.FC<AcceptQuoteCardProps> = ({
  quote: initialQuote,
}) => {
  const [quoteData, setQuoteData] = useState<QuoteResponse>(initialQuote);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableEntries, setTableEntries] = useState<QuoteEntry[]>([
    { description: "Amount due", value: "" },
    { description: "Quoted price expires in", value: "" },
  ]);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const dispatch = useDispatch();
  const selectedCurrency = useSelector(
    (state: RootState) => state.currency.selectedCurrency
  );

  // Helper function to format milliseconds to HH:MM:SS.
  const formatTime = (ms: number): string => {
    return moment.utc(ms).format("HH:mm:ss");
  };

  // Update table entries using the latest quote data.
  const updateTableEntries = (quote: QuoteResponse) => {
    const amountDue = `${quote.paidCurrency.amount} ${
      quote.paidCurrency.currency || ""
    }`.trim();
    const expiresIn = quote.acceptanceExpiryDate
      ? formatTime(quote.acceptanceExpiryDate - Date.now())
      : "";
    setTableEntries([
      { description: "Amount due", value: amountDue },
      { description: "Quoted price expires in", value: expiresIn },
    ]);
  };

  // Update table entries whenever quoteData changes.
  useEffect(() => {
    updateTableEntries(quoteData);
    if (quoteData.acceptanceExpiryDate) {
      setRemainingTime(quoteData.acceptanceExpiryDate - Date.now());
    }
  }, [quoteData]);

  // Countdown effect: update every second and auto-trigger update when the timer expires.
  useEffect(() => {
    if (quoteData && quoteData.acceptanceExpiryDate) {
      let autoUpdating = false;
      const intervalId = setInterval(() => {
        const now = Date.now();
        const diff = quoteData.acceptanceExpiryDate - now;
        if (diff <= 0 && !autoUpdating) {
          // Timer expired - call the API update repeatedly
          autoUpdating = true;
          handleAutoUpdate().finally(() => {
            // After update, autoUpdating resets and the new quoteData (with a new timer) takes effect
            autoUpdating = false;
          });
        } else if (diff > 0) {
          setRemainingTime(diff);
          setTableEntries((prev) =>
            prev.map((entry) =>
              entry.description === "Quoted price expires in"
                ? { ...entry, value: formatTime(diff) }
                : entry
            )
          );
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [quoteData]);

  // Trigger an automatic update when the timer expires.
  const handleAutoUpdate = async () => {
    try {
      const currency: string =
        quoteData.paidCurrency.currency ?? currencyOptions[0].value;
      const payload: UpdateQuoteRequest = {
        currency: currency,
        payInMethod: "crypto",
      };

      // Update the quote and update state with the new quote data.
      const updatedQuote = (await updateQuoteSummary(
        quoteData.uuid,
        payload
      )) as QuoteResponse;
      setQuoteData(updatedQuote);
    } catch (error: any) {
      console.error("Auto-update error:", error);
    }
  };

  // Called when a new currency is selected via the dropdown.
  const handleCurrencyChange = async (value: string) => {
    const payload: UpdateQuoteRequest = {
      currency: value,
      payInMethod: "crypto",
    };
    dispatch(setCurrency(value));
    try {
      const updatedQuote = (await updateQuoteSummary(
        quoteData.uuid,
        payload
      )) as QuoteResponse;
      setQuoteData(updatedQuote);
    } catch (error: any) {
      console.error("Error updating quote summary:", error);
    }
  };

  // Handler for the Confirm button.
  const handleClick = () => {
    setLoading(true);
    // Simulate an async action
    setTimeout(() => {
      setLoading(false);
      console.log("Button clicked!");
    }, 2000);
  };

  return (
    <Card>
      <h3 className="heading font-medium m-[4px]">
        {quoteData.merchantDisplayName}
      </h3>
      <h2 className="currency-value font-semibold">
        {quoteData.displayCurrency.amount}{" "}
        <span className="currency">{quoteData.displayCurrency.currency}</span>
      </h2>
      <p className="value-label my-[25px]">
        For the reference number:{" "}
        <span className="value font-medium">{quoteData.reference}</span>
      </p>
      <Dropdown
        label="Pay with"
        placeholder="Select Currency"
        options={currencyOptions}
        onChange={handleCurrencyChange}
        initialValue={selectedCurrency}
      />
      {selectedCurrency && (
        <>
          <div className="quote-summary-container w-full my-[25px]">
            <QuoteSummaryTable entries={tableEntries} />
          </div>
          <div className="btn-container w-full">
            <PrimaryButton
              label="Confirm"
              loading={loading}
              onClick={handleClick}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default AcceptQuoteCard;
