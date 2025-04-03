import { render, screen } from "@testing-library/react";
import CenteredLayout from "@/components/layouts/CenteredLayout";
import React from "react";

describe("CenteredLayout Component", () => {
  test("renders children content", () => {
    render(
      <CenteredLayout>
        <div>Test Child</div>
      </CenteredLayout>
    );
    // Verify that the child content is rendered.
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  test("has expected container classes", () => {
    const { container } = render(
      <CenteredLayout>
        <div>Test Child</div>
      </CenteredLayout>
    );
    const layoutContainer = container.firstChild as HTMLElement;
    // Verify that the container has the expected Tailwind classes.
    expect(layoutContainer).toHaveClass("centered-layout-container");
    expect(layoutContainer).toHaveClass("flex");
    expect(layoutContainer).toHaveClass("flex-col");
    expect(layoutContainer).toHaveClass("justify-center");
    expect(layoutContainer).toHaveClass("items-center");
    expect(layoutContainer).toHaveClass("min-h-screen");
    expect(layoutContainer).toHaveClass("p-4");
  });
});
