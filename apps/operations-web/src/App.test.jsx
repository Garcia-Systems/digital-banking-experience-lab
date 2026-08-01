import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App.jsx";

afterEach(() => window.history.pushState({}, "", "/"));

describe("operations portal", () => {
  it("renders dashboard metrics and navigation", () => {
    render(<App />);
    expect(screen.getByText("System Health")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveTextContent(
      "DashboardMembersTransfers",
    );
  });

  it("filters member fixtures by name and member ID", () => {
    window.history.pushState({}, "", "/members");
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Jordan" },
    });
    expect(screen.getByText("member-1002")).toBeInTheDocument();
    expect(screen.queryByText("member-1001")).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "member-1003" },
    });
    expect(screen.getByText("Sam Rivera")).toBeInTheDocument();
  });

  it("shows transfer review links", () => {
    window.history.pushState({}, "", "/transfers");
    render(<App />);
    expect(screen.getByRole("link", { name: "transfer-7001" })).toHaveAttribute(
      "href",
      "/transfers/transfer-7001",
    );
    expect(screen.getByText("$125.00")).toBeInTheDocument();
  });

  it("handles unauthorized access", () => {
    render(<App role="member-user" />);
    expect(
      screen.getByRole("heading", { name: "Operations access required" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
