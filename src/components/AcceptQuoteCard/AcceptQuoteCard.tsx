"use client";

import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import {
  acceptQuotePayload,
  currencyOptions,
  defaultQuoteValues,
} from "@/constants/currencies";
import QuoteSummaryTable from "../QouteSummaryTable/QuoteSummaryTable";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import {
  AcceptQuoteCardProps,
  AcceptQuoteRequest,
  QuoteResponse,
  UpdateQuoteRequest,
} from "@/types/api.types";
import { acceptQuote, updateQuoteSummary } from "@/services/api";
import { QuoteEntry } from "@/types/QuoteSummay.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrency } from "@/store/currencySlice";
import { useRouter } from "next/navigation";

const AcceptQuoteCard: React.FC<AcceptQuoteCardProps> = ({
  quote: initialQuote,
}) => {
  const [quoteData, setQuoteData] = useState<QuoteResponse>(initialQuote);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableEntries, setTableEntries] =
    useState<QuoteEntry[]>(defaultQuoteValues);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [updateError, setUpdateError] = useState<string | null>(null);
  // This boolean becomes true if the PUT update call is successful and false if it fails.
  const [isQuoteUpdateSuccessful, setIsQuoteUpdateSuccessful] =
    useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const selectedCurrency = useSelector(
    (state: RootState) => state.currency.selectedCurrency
  );

  // Ref to prevent scheduling duplicate auto-update calls.
  const autoUpdateScheduledRef = useRef(false);
  // Ref to ensure the initial update (on page load) happens only once.
  const initialUpdateCalledRef = useRef(false);

  // Helper to format milliseconds into HH:MM:SS.
  const formatTime = (ms: number): string => moment.utc(ms).format("HH:mm:ss");

  const updateTableEntries = (quote: QuoteResponse) => {
    const amountDue = `${quote.paidCurrency.amount} ${
      quote.paidCurrency.currency || ""
    }`.trim();
    const expiresIn = quote.acceptanceExpiryDate
      ? formatTime(quote.acceptanceExpiryDate - Date.now())
      : "";
    if (isQuoteUpdateSuccessful) {
      setTableEntries([
        { description: "Amount due", value: amountDue },
        { description: "Quoted price expires in", value: expiresIn },
      ]);
    }
  };

  // Update display whenever quoteData changes.
  useEffect(() => {
    updateTableEntries(quoteData);
    if (quoteData.acceptanceExpiryDate) {
      setRemainingTime(quoteData.acceptanceExpiryDate - Date.now());
    }
    // Reset the auto-update scheduler when the quote changes.
    autoUpdateScheduledRef.current = false;
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

  // Auto-update trigger: schedule one update call when the quote expires.
  useEffect(() => {
    if (updateError) return;
    if (!quoteData || !quoteData.acceptanceExpiryDate) return;
    if (autoUpdateScheduledRef.current) return; // already scheduled

    const now = Date.now();
    const diff = quoteData.acceptanceExpiryDate - now;

    if (diff <= 0) {
      autoUpdateScheduledRef.current = true;
      handleAutoUpdate().finally(() => {
        autoUpdateScheduledRef.current = false;
      });
    } else {
      autoUpdateScheduledRef.current = true;
      const timeoutId = setTimeout(() => {
        handleAutoUpdate().finally(() => {
          autoUpdateScheduledRef.current = false;
        });
      }, diff);
      return () => clearTimeout(timeoutId);
    }
  }, [quoteData, updateError]);

  // New effect: if there is a selectedCurrency value, call the updateQuote PUT API on page load.
  useEffect(() => {
    if (!initialUpdateCalledRef.current && selectedCurrency) {
      initialUpdateCalledRef.current = true;
      // We call the same function as manual currency change.
      handleCurrencyChange(selectedCurrency);
    }
  }, [selectedCurrency]);

  // The auto-update function which calls the PUT API.
  const handleAutoUpdate = async () => {
    setTableEntries(defaultQuoteValues);
    try {
      const currency: string =
        quoteData.paidCurrency.currency ?? currencyOptions[0].value;
      const payload: UpdateQuoteRequest = { currency, payInMethod: "crypto" };

      const updatedQuote = (await updateQuoteSummary(
        quoteData.uuid,
        payload
      )) as QuoteResponse;

      // If the API returns the specific error, update the boolean and set error.
      if (
        updatedQuote.code === "MER-PAY-2017" &&
        updatedQuote.parameter === "payment" &&
        updatedQuote.message === "cannot update payment with status EXPIRED"
      ) {
        setUpdateError(updatedQuote.message);
        setIsQuoteUpdateSuccessful(false);
        return;
      }
      // Otherwise, update state and mark the update as successful.
      setQuoteData(updatedQuote);
      setIsQuoteUpdateSuccessful(true);
    } catch (error: any) {
      console.error("Auto-update error:", error);
      setIsQuoteUpdateSuccessful(false);
    }
  };

  // Called when a new currency is selected via the dropdown.
  const handleCurrencyChange = async (value: string) => {
    setTableEntries(defaultQuoteValues);
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
      // For the manual update, mark the update as successful.
      setQuoteData(updatedQuote);
      setIsQuoteUpdateSuccessful(true);
    } catch (error: any) {
      console.error("Error updating quote summary:", error);
      setIsQuoteUpdateSuccessful(false);
    }
  };

  // Handler for the Confirm button.
  const handleClick = async () => {
    setLoading(true);
    try {
      // Construct payload as per the AcceptQuoteRequest interface.
      const payload: AcceptQuoteRequest = acceptQuotePayload;
      await acceptQuote(quoteData.uuid, payload);
      // On success, redirect to /payin/<UUID>/pay
      router.push(`/payin/${quoteData.uuid}/pay`);
    } catch (error: any) {
      console.error("Failed to accept quote:", error);
    } finally {
      setLoading(false);
    }
  };

  // If an update error occurred, show the error and stop further auto-updates.
  if (updateError) {
    return (
      <Card>
        <h3 className="heading font-medium m-[4px]">Error: {updateError}</h3>
      </Card>
    );
  }

  console.log("is quote gen", isQuoteUpdateSuccessful);
  console.log("selected value", selectedCurrency);
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
            <QuoteSummaryTable
              entries={tableEntries}
              isQuoteGenerated={isQuoteUpdateSuccessful}
            />
          </div>
          {isQuoteUpdateSuccessful && (
            <div className="btn-container w-full">
              <PrimaryButton
                label={loading ? "Processing" : "Confirm"}
                loading={loading}
                onClick={handleClick}
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default AcceptQuoteCard;
