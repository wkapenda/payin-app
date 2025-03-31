"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation"; // Next.js hook for dynamic routes in the App Router
import CenteredLayout from "@/components/layouts/CenteredLayout";
import AcceptQuoteCard from "@/components/AcceptQuoteCard/AcceptQuoteCard";
import { fetchQuoteSummary } from "@/services/api";
import Loader from "@/components/Loader/Loader";
import { QuoteResponse } from "@/types/api.types";

const AcceptQuotePage: React.FC = () => {
  const { uuid } = useParams();
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (uuid && !hasFetched.current) {
      hasFetched.current = true;
      fetchQuoteSummary(uuid.toString())
        .then((data) => setQuote(data))
        .catch((err) => setError(err.message));
    }
  }, [uuid]);

  if (error) {
    return (
      <CenteredLayout>
        <div>Error: {error}</div>
      </CenteredLayout>
    );
  }

  if (!quote) {
    return <Loader />;
  }

  return (
    <CenteredLayout>
      <AcceptQuoteCard quote={quote} />
    </CenteredLayout>
  );
};

export default AcceptQuotePage;
