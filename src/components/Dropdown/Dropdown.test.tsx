import { render, screen } from "@testing-library/react";
import Dropdown from "@/components/Dropdown/Dropdown";
import React from "react";

const options = [
  { label: "Bitcoin", value: "BTC" },
  { label: "Ethereum", value: "ETH" },
  { label: "Litecoin", value: "LTC" },
];

describe("Dropdown Component", () => {
  test("renders with label and placeholder when no initial value is provided", () => {
    render(
      <Dropdown
        label="Pay with"
        placeholder="Select Currency"
        options={options}
      />
    );
    // Verify label is rendered.
    expect(screen.getByText("Pay with")).toBeInTheDocument();
    // Verify placeholder text is rendered.
    expect(screen.getByText("Select Currency")).toBeInTheDocument();
  });

  test("displays selected option label when initialValue is provided", () => {
    render(
      <Dropdown
        label="Pay with"
        placeholder="Select Currency"
        options={options}
        initialValue="ETH"
      />
    );
    // The trigger should now show "Ethereum" instead of "Select Currency".
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });
});
