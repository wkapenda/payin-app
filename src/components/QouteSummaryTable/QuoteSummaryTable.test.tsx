import { render, screen } from "@testing-library/react";
import React from "react";
import { QuoteEntry } from "@/types/QuoteSummay.types";
import QuoteSummaryTable from "./QuoteSummaryTable";

const dummyEntries: QuoteEntry[] = [
  { description: "Amount due", value: "100", isCopy: false },
  {
    description: "Quoted price expires in",
    value: "00:30:00",
    isCopy: false,
    qrCodeUrl: "https://example.com/qr.png",
  },
];

describe("QuoteSummaryTable Component", () => {
  test("renders all entries and displays QR code when provided", () => {
    render(
      <QuoteSummaryTable entries={dummyEntries} isQuoteGenerated={true} />
    );

    // Check that the entry texts are rendered.
    expect(screen.getByText("Amount due")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Quoted price expires in")).toBeInTheDocument();

    // "00:30:00" should appear twice: once in the labelled value and once in the QR code block.
    const timeTexts = screen.getAllByText("00:30:00");
    expect(timeTexts).toHaveLength(2);

    // Verify that the QR code image is rendered using its alt text.
    expect(screen.getByAltText("QR Code")).toBeInTheDocument();
  });

  test("does not render QR code block if qrCodeUrl is not provided", () => {
    const entriesWithoutQR: QuoteEntry[] = [
      { description: "Amount due", value: "200", isCopy: false },
      {
        description: "Quoted price expires in",
        value: "00:45:00",
        isCopy: false,
      },
    ];
    render(
      <QuoteSummaryTable entries={entriesWithoutQR} isQuoteGenerated={true} />
    );

    // Ensure no QR Code image is rendered.
    expect(screen.queryByAltText("QR Code")).toBeNull();
  });
});
