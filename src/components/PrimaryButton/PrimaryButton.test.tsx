import { render, screen, fireEvent } from "@testing-library/react";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import React from "react";
import { PrimaryButtonProps } from "@/types/PrimaryButton.types";

describe("PrimaryButton Component", () => {
  const defaultProps: PrimaryButtonProps = {
    label: "Confirm",
    loading: false,
    disabled: false,
    onClick: jest.fn(),
  };

  test("renders with default label", () => {
    render(<PrimaryButton {...defaultProps} />);
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  test("renders with custom label", () => {
    render(<PrimaryButton {...defaultProps} label="Submit" />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("renders loading icon when loading is true and disables the button", async () => {
    render(<PrimaryButton {...defaultProps} loading={true} />);
    // Use a custom matcher to check for the loader icon.
    const loaderIcon = screen.getByText((content, element) => {
      if (!element) return false;
      return (
        element.classList.contains("primary-button__icon") &&
        element.classList.contains("animate-spin")
      );
    });
    expect(loaderIcon).toBeInTheDocument();
    // Check that the button is disabled.
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<PrimaryButton {...defaultProps} onClick={handleClick} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
