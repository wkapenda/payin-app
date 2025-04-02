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
  // Ref to prevent concurrent manual update calls.
  const manualUpdateInProgressRef = useRef<boolean>(false);

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
        { description: "Amount due", value: amountDue, isCopy: false },
        {
          description: "Quoted price expires in",
          value: expiresIn,
          isCopy: false,
        },
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

  // On mount: if there's a pre-selected currency, update the quote once.
  useEffect(() => {
    if (!initialUpdateCalledRef.current && selectedCurrency) {
      initialUpdateCalledRef.current = true;
      handleCurrencyChange(selectedCurrency);
    }
    // Run only on mount.
  }, []);

  // The auto-update function which calls the PUT API.
  const handleAutoUpdate = async (): Promise<void> => {
    setTableEntries(defaultQuoteValues);
    try {
      const currency: string =
        quoteData.paidCurrency.currency ?? currencyOptions[0].value;
      const payload: UpdateQuoteRequest = { currency, payInMethod: "crypto" };

      const updatedQuote = (await updateQuoteSummary(
        quoteData.uuid,
        payload
      )) as QuoteResponse;

      setQuoteData(updatedQuote);
      setIsQuoteUpdateSuccessful(true);
    } catch (error: unknown) {
      router.push(`/payin/${quoteData.uuid}/expired`);
      console.log(error);
      setIsQuoteUpdateSuccessful(false);
      setUpdateError("Payment expired");
    }
  };

  // Called when a new currency is selected via the dropdown.
  const handleCurrencyChange = async (value: string): Promise<void> => {
    if (manualUpdateInProgressRef.current) return; // Prevent duplicate manual updates.
    manualUpdateInProgressRef.current = true;
    // Reset table entries to default state before making the API call.
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
      setQuoteData(updatedQuote);
      setIsQuoteUpdateSuccessful(true);
    } catch (error: unknown) {
      router.push(`/payin/${quoteData.uuid}/expired`);
      console.log(error);
      manualUpdateInProgressRef.current = false;
      setIsQuoteUpdateSuccessful(false);
      setUpdateError("Payment expired");
    } finally {
      manualUpdateInProgressRef.current = false;
    }
  };

  const handleClick = async (): Promise<void> => {
    setLoading(true);
    try {
      const payload: AcceptQuoteRequest = acceptQuotePayload;
      await acceptQuote(quoteData.uuid, payload);
      // On success, redirect to the Pay Quote page.
      router.push(`/payin/${quoteData.uuid}/pay`);
    } catch (error: unknown) {
      // If the API call fails, assume the payment has expired.
      router.push(`/payin/${quoteData.uuid}/expired`);
      console.log(error);
    } finally {
      setLoading(false);
    }
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
