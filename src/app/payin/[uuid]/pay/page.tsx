"use client";

import CenteredLayout from "@/components/layouts/CenteredLayout";
import Loader from "@/components/Loader/Loader";
import PayQuoteCard from "@/components/PayQuoteCard/PayQuoteCard";
import { fetchQuoteSummary } from "@/services/api";
import { QuoteResponse } from "@/types/api.types";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const Page: React.FC = () => {
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
      <PayQuoteCard quote={quote} />
    </CenteredLayout>
  );
};

export default Page;
