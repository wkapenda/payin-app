import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LabelledValue from "@/components/LabelledValue/LabelledValue";
import React from "react";

// Mock the helper to return the value unchanged.
jest.mock("@/utils/helpers", () => ({
  shortenValue: (value: string) => value,
}));

describe("LabelledValue Component", () => {
  const defaultProps = {
    description: "Amount due",
    value: "1000 USD",
    isQuoteGenerated: true,
    isCopy: true,
  };

  beforeAll(() => {
    // Mock navigator.clipboard.writeText.
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(Promise.resolve()),
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders description and value", () => {
    render(<LabelledValue {...defaultProps} />);
    // Check that the description and value appear.
    expect(screen.getByText("Amount due")).toBeInTheDocument();
    expect(screen.getByText("1000 USD")).toBeInTheDocument();
  });

  test("renders Copy button when isCopy is true", () => {
    render(<LabelledValue {...defaultProps} />);
    // The copy button should be rendered with text "Copy".
    const copyButton = screen.getByRole("button");
    expect(copyButton).toBeInTheDocument();
    expect(copyButton).toHaveTextContent("Copy");
  });

  test("changes button text to 'Copied!' after clicking copy", async () => {
    render(<LabelledValue {...defaultProps} />);
    const copyButton = screen.getByRole("button");
    fireEvent.click(copyButton);
    await waitFor(() => {
      expect(copyButton).toHaveTextContent("Copied!");
    });
  });
});
