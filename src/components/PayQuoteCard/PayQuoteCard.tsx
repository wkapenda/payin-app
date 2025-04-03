"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import Card from "../Card/Card";
import QuoteSummaryTable from "../QouteSummaryTable/QuoteSummaryTable";
import { PayQuoteCardProps, QuoteEntry } from "@/types/QuoteSummay.types";
import { defaultPayQuoteValues } from "@/constants/currencies";
import { useRouter } from "next/navigation";
import { getCurrencyLabel } from "@/utils/helpers";

const PayQuoteCard: React.FC<PayQuoteCardProps> = ({
  quote: acceptedQuote,
}) => {
  const [tableEntries, setTableEntries] = useState<QuoteEntry[]>(
    defaultPayQuoteValues
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const router = useRouter();

  // Format time (HH:MM:SS) from milliseconds
  const formatTime = (ms: number): string => moment.utc(ms).format("HH:mm:ss");

  const label = getCurrencyLabel(acceptedQuote.paidCurrency?.currency);

  // Update timeLeft based on expiryDate
  useEffect(() => {
    if (!acceptedQuote.expiryDate) return;
    const updateTime = () => {
      const diff = acceptedQuote.expiryDate - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
      if (diff <= 0) {
        // When expired, redirect to expired page.
        router.push(`/payin/${acceptedQuote.uuid}/expired`);
      }
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [acceptedQuote.expiryDate, acceptedQuote.uuid, router]);

  // Generate QR code URL (using a free public API)
  const qrCodeUrl: string = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    acceptedQuote?.address?.address
  )}&size=150x150`;

  // Update table entries whenever quoteData or timeLeft changes.
  useEffect(() => {
    setTableEntries([
      {
        description: "Amount due",
        value: `${acceptedQuote.paidCurrency?.amount} ${acceptedQuote.paidCurrency?.currency}`,
        isCopy: true,
      },
      {
        description: `${acceptedQuote.paidCurrency?.currency} address`,
        value: acceptedQuote?.address?.address,
        isCopy: true,
        qrCodeUrl: qrCodeUrl,
      },
      {
        description: "Time left to pay",
        value: formatTime(timeLeft),
        isCopy: false,
      },
    ]);
  }, [acceptedQuote, timeLeft]);

  // Redirect based on quote status
  useEffect(() => {
    if (acceptedQuote.status === "ACCEPTED") {
      router.push(`/payin/${acceptedQuote.uuid}/pay`);
    } else if (acceptedQuote.status === "EXPIRED") {
      router.push(`/payin/${acceptedQuote.uuid}/expired`);
    }
  }, [acceptedQuote.status, acceptedQuote.uuid, router]);

  return (
    <Card>
      <h3 className="heading font-medium m-[4px]">Pay with {label}</h3>
      <p className="value-label text-center my-[25px]">
        To complete this payment, send the amount due to the BTC address
        provided below.
      </p>

      <div className="quote-summary-container w-full my-[25px]">
        <QuoteSummaryTable entries={tableEntries} isQuoteGenerated={true} />
      </div>
    </Card>
  );
};

export default PayQuoteCard;
