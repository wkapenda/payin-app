import {
  AcceptQuoteRequest,
  QuoteResponse,
  UpdateQuoteRequest,
  UpdateQuoteResponse,
} from "@/types/api.types";

export async function fetchQuoteSummary(uuid: string): Promise<QuoteResponse> {
  const res = await fetch(
    `https://api.sandbox.bvnk.com/api/v1/pay/${uuid}/summary`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch quote summary: ${res.statusText}`);
  }
  return res.json();
}

export async function updateQuoteSummary(
  uuid: string,
  payload: UpdateQuoteRequest
): Promise<UpdateQuoteResponse> {
  const res = await fetch(
    `https://api.sandbox.bvnk.com/api/v1/pay/${uuid}/update/summary`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to update quote summary: ${res.statusText}`);
  }
  return res.json();
}

export async function acceptQuote(
  uuid: string,
  payload: object
): Promise<AcceptQuoteRequest> {
  const res = await fetch(
    `https://api.sandbox.bvnk.com/api/v1/pay/${uuid}/accept/summary`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to accept quote: ${res.statusText}`);
  }
  return res.json();
}

export async function refreshQuoteSummary(
  uuid: string,
  payload: UpdateQuoteRequest
): Promise<UpdateQuoteResponse> {
  const res = await fetch(
    `https://api.sandbox.bvnk.com/api/v1/pay/${uuid}/summary`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to refresh quote summary: ${res.statusText}`);
  }
  return res.json();
}
