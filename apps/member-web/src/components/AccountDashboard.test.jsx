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
      "Balances may be out of date",
    );
  });

  it("does not show the stale warning for a fresh projection", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders the projection's last-updated value", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(screen.getByText(/Last updated/)).toHaveTextContent(
      "Jul 31, 2026, 12:00 PM UTC",
    );
  });
});
