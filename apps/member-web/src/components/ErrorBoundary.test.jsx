import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

function BrokenFeature() {
  throw new Error("deterministic render failure");
}

describe("ErrorBoundary", () => {
  it("replaces an unexpected rendering failure with an isolated fallback", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <BrokenFeature />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", {
        name: "This page could not be displayed.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Other features are still available/),
    ).toBeInTheDocument();
  });
});
