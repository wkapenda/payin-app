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
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isQuoteUpdateSuccessful, setIsQuoteUpdateSuccessful] =
    useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const selectedCurrency = useSelector(
    (state: RootState) => state.currency.selectedCurrency
  );

  // Refs to prevent duplicate updates.
  const autoUpdateScheduledRef = useRef(false);
  const initialUpdateCalledRef = useRef(false);
  const manualUpdateInProgressRef = useRef(false);

  // Helper: format milliseconds into HH:MM:SS.
  const formatTime = (ms: number): string => moment.utc(ms).format("HH:mm:ss");

  // Update table entries using current quote data.
  const updateTableEntries = (quote: QuoteResponse): void => {
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
    // Reset auto-update scheduler when quote data changes.
    autoUpdateScheduledRef.current = false;
  }, [quoteData]);

  // Countdown: update the "Quoted price expires in" field every second.
  useEffect(() => {
    if (updateError) return;
    const intervalId = setInterval(() => {
      if (quoteData?.acceptanceExpiryDate) {
        const diff = quoteData.acceptanceExpiryDate - Date.now();
        if (diff > 0) {
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

  // Auto-update: trigger a refresh when the acceptanceExpiryDate is reached.
  useEffect(() => {
    if (updateError || !quoteData?.acceptanceExpiryDate) return;
    if (autoUpdateScheduledRef.current) return;
    const diff = quoteData.acceptanceExpiryDate - Date.now();
    autoUpdateScheduledRef.current = true;
    const timeoutId =
      diff <= 0
        ? // If already expired, update immediately.
          (async () => {
            await handleAutoUpdate();
            autoUpdateScheduledRef.current = false;
          })()
        : setTimeout(async () => {
            await handleAutoUpdate();
            autoUpdateScheduledRef.current = false;
          }, diff);
    return () => clearTimeout(timeoutId as NodeJS.Timeout);
  }, [quoteData, updateError]);

  // On mount: if a pre-selected currency exists, update the quote once.
  useEffect(() => {
    if (!initialUpdateCalledRef.current && selectedCurrency) {
      initialUpdateCalledRef.current = true;
      handleCurrencyChange(selectedCurrency);
    }
    // Run only once on mount.
  }, []);

  // Auto-update function: calls updateQuoteSummary API.
  const handleAutoUpdate = async (): Promise<void> => {
    setTableEntries(defaultQuoteValues);
    try {
      const currency =
        quoteData.paidCurrency.currency ?? currencyOptions[0].value;
      const payload: UpdateQuoteRequest = { currency, payInMethod: "crypto" };
      const updatedQuote = (await updateQuoteSummary(
        quoteData.uuid,
        payload
      )) as QuoteResponse;
      setQuoteData(updatedQuote);
      setIsQuoteUpdateSuccessful(true);
    } catch (error: unknown) {
      console.log(error);
      setIsQuoteUpdateSuccessful(false);
      setUpdateError("Payment expired");
      router.push(`/payin/${quoteData.uuid}/expired`);
    }
  };

  // Manual update: called when a new currency is selected.
  const handleCurrencyChange = async (value: string): Promise<void> => {
    if (manualUpdateInProgressRef.current) return;
    manualUpdateInProgressRef.current = true;
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
      console.log(error);
      setIsQuoteUpdateSuccessful(false);
      setUpdateError("Payment expired");
      router.push(`/payin/${quoteData.uuid}/expired`);
    } finally {
      manualUpdateInProgressRef.current = false;
    }
  };

  // Confirm handler: calls acceptQuote API.
  const handleClick = async (): Promise<void> => {
    setLoading(true);
    try {
      const payload: AcceptQuoteRequest = acceptQuotePayload;
      await acceptQuote(quoteData.uuid, payload);
      router.push(`/payin/${quoteData.uuid}/pay`);
    } catch (error: unknown) {
      console.log(error);
      router.push(`/payin/${quoteData.uuid}/expired`);
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
