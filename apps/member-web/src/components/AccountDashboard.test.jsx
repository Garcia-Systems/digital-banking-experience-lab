import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  freshAccountDashboard,
  staleAccountDashboard,
} from "../data/accountDashboardFixtures";
import AccountDashboard from "./AccountDashboard";

describe("account dashboard", () => {
  it("renders the fictional member and both deposit accounts", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(
      screen.getByRole("heading", { name: /Alex Morgan/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Everyday Checking" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Member Savings" }),
    ).toBeInTheDocument();
  });

  it("renders account type badges derived from each account", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(screen.getByText("Checking")).toHaveClass("account-type-badge");
    expect(screen.getByText("Savings")).toHaveClass("account-type-badge");
  });

  it("renders the status of each account as text", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    const cards = screen.getAllByRole("article");
    expect(
      within(cards[0]).getByText("Status:", { exact: false }),
    ).toHaveTextContent("Status: Open");
    expect(
      within(cards[1]).getByText("Status:", { exact: false }),
    ).toHaveTextContent("Status: Dormant");
  });

  it("renders an empty recent-activity message for every account", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(
      screen.getAllByRole("heading", { name: "Recent activity" }),
    ).toHaveLength(2);
    expect(screen.getAllByText("No recent transactions.")).toHaveLength(2);
  });

  it("shows masked suffixes without exposing internal account identifiers", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(screen.getByLabelText("Account ending in 4821")).toHaveTextContent(
      "•••• 4821",
    );
    expect(screen.getByLabelText("Account ending in 7314")).toHaveTextContent(
      "•••• 7314",
    );
    expect(screen.queryByText("account-2001")).not.toBeInTheDocument();
    expect(screen.queryByText("account-2002")).not.toBeInTheDocument();
  });

  it("formats integer cents as user-visible US dollar balances", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    const checkingCard = screen
      .getByRole("heading", { name: "Everyday Checking" })
      .closest("article");
    const savingsCard = screen
      .getByRole("heading", { name: "Member Savings" })
      .closest("article");

    expect(checkingCard).not.toBeNull();
    expect(savingsCard).not.toBeNull();
    expect(
      within(checkingCard).getByText("Available balance").parentElement,
    ).toHaveTextContent("$1,250.00");
    expect(
      within(checkingCard).getByText("Current balance").parentElement,
    ).toHaveTextContent("$1,305.00");
    expect(
      within(savingsCard).getByText("Available balance").parentElement,
    ).toHaveTextContent("$4,200.00");
    expect(
      within(savingsCard).getByText("Current balance").parentElement,
    ).toHaveTextContent("$4,200.00");
  });

  it("shows an accessible warning for a stale projection", () => {
    render(<AccountDashboard dashboard={staleAccountDashboard} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Balances may be out of date. This account snapshot could not be refreshed and is based on stale projection data.",
    );
  });

  it("identifies a fresh projection as current without a stale warning", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Projection is current. This dashboard is based on the latest available projection data.",
    );
    expect(
      screen.queryByText("Balances may be out of date", { exact: false }),
    ).not.toBeInTheDocument();
  });

  it("renders the projection's last-updated value", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(screen.getByText(/Last updated/)).toHaveTextContent(
      "Jul 31, 2026, 12:00 PM UTC",
    );
  });
});
