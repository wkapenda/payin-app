import { render, screen } from "@testing-library/react";
import Card from "@/components/Card/Card";
import React from "react";

describe("Card Component", () => {
  test("renders children content", () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("applies default padding when no padding prop is provided", () => {
    const { container } = render(<Card>Test Content</Card>);
    const cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv).toHaveStyle({ padding: "25px" });
  });

  test("applies provided padding", () => {
    const { container } = render(<Card padding="10px">Test Content</Card>);
    const cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv).toHaveStyle({ padding: "10px" });
  });
});
