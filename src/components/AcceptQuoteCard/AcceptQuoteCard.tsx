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

// Global map to ensure auto-update is called only once per quote UUID.
const autoUpdateCalledMap = new Map<string, boolean>();

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
  const [updateError, setUpdateError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const selectedCurrency = useSelector(
    (state: RootState) => state.currency.selectedCurrency
  );

  // Helper to format milliseconds into HH:MM:SS.
  const formatTime = (ms: number): string => moment.utc(ms).format("HH:mm:ss");

  // Update table entries from the current quote data.
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

  // Update display whenever quoteData changes.
  useEffect(() => {
    updateTableEntries(quoteData);
    if (quoteData.acceptanceExpiryDate) {
      setRemainingTime(quoteData.acceptanceExpiryDate - Date.now());
    }
  }, [quoteData]);

  // Countdown display: update every second.
  useEffect(() => {
    if (updateError) return;
    const intervalId = setInterval(() => {
      if (quoteData && quoteData.acceptanceExpiryDate) {
        const diff = quoteData.acceptanceExpiryDate - Date.now();
        if (diff > 0) {
          setRemainingTime(diff);
          setTableEntries((prev) =>
            prev.map((entry) =>
              entry.description === "Quoted price expires in"
                ? { ...entry, value: formatTime(diff) }
                : entry
            )
          );
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [quoteData, updateError]);

  // Auto-update trigger: schedule a one-time update when the quote expires.
  useEffect(() => {
    if (updateError) return;
    if (!quoteData || !quoteData.acceptanceExpiryDate) return;

    // Prevent duplicate auto-update calls for the same quote.
    if (autoUpdateCalledMap.has(quoteData.uuid)) return;

    const now = Date.now();
    const diff = quoteData.acceptanceExpiryDate - now;
    if (diff <= 0) {
      autoUpdateCalledMap.set(quoteData.uuid, true);
      handleAutoUpdate();
    } else {
      const timeoutId = setTimeout(() => {
        autoUpdateCalledMap.set(quoteData.uuid, true);
        handleAutoUpdate();
      }, diff);
      return () => clearTimeout(timeoutId);
    }
  }, [quoteData, updateError]);

  // Auto-update function: calls the PUT update API.
  const handleAutoUpdate = async () => {
    try {
      const currency: string =
        quoteData.paidCurrency.currency ?? currencyOptions[0].value;
      const payload: UpdateQuoteRequest = { currency, payInMethod: "crypto" };

      const updatedQuote = (await updateQuoteSummary(
        quoteData.uuid,
        payload
      )) as QuoteResponse;

      // If the response contains the specific error, set error state to stop further calls.
      if (
        updatedQuote.code === "MER-PAY-2017" &&
        updatedQuote.parameter === "payment" &&
        updatedQuote.message === "cannot update payment with status EXPIRED"
      ) {
        setUpdateError(updatedQuote.message);
        return;
      }
      // Update the quote data.
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
    setTimeout(() => {
      setLoading(false);
      console.log("Button clicked!");
    }, 2000);
  };

  // If an update error occurred, show the error and stop further auto-updates.
  if (updateError) {
    return (
      <Card>
        <h3 className="heading font-medium m-[4px]">Error: {updateError}</h3>
      </Card>
    );
  }

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
