import { render } from "@testing-library/react";
import Loader from "@/components/Loader/Loader";
import React from "react";

describe("Loader Component", () => {
  test("renders the spinner inside CenteredLayout", () => {
    const { container } = render(<Loader />);
    // Query for the SVG element directly.
    const spinner = container.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });
});
