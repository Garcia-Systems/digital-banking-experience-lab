import { screen, within } from "@testing-library/react";
import { renderWithRouter } from "../test/renderWithRouter";
import { describe, expect, it } from "vitest";
import {
  emptyAccountDashboard,
  freshAccountDashboard,
  staleAccountDashboard,
} from "../data/accountDashboardFixtures";
import AccountDashboard from "./AccountDashboard";

describe("account dashboard", () => {
  it("renders the fictional member and both deposit accounts", () => {
    renderWithRouter(<AccountDashboard dashboard={freshAccountDashboard} />);

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

  it("renders one accessibly named account card for each fixture account", () => {
    renderWithRouter(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(screen.getAllByRole("article")).toHaveLength(
      freshAccountDashboard.accounts.length,
    );
    expect(
      screen.getByRole("article", {
        name: "Everyday Checking, checking account",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("article", {
        name: "Member Savings, savings account",
      }),
    ).toBeInTheDocument();
  });

  it("renders account type badges derived from each account", () => {
    renderWithRouter(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(screen.getByText("Checking")).toHaveClass("account-type-badge");
    expect(screen.getByText("Savings")).toHaveClass("account-type-badge");
  });

  it("renders the status of each account as text", () => {
    renderWithRouter(<AccountDashboard dashboard={freshAccountDashboard} />);

    const cards = screen.getAllByRole("article");
    expect(
      within(cards[0]).getByText("Status:", { exact: false }),
    ).toHaveTextContent("Status: Open");
    expect(
      within(cards[1]).getByText("Status:", { exact: false }),
    ).toHaveTextContent("Status: Dormant");
  });

  it("renders an empty recent-activity message for every account", () => {
    renderWithRouter(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(
      screen.getAllByRole("heading", { name: "Recent activity" }),
    ).toHaveLength(2);
    expect(screen.getAllByText("No recent transactions.")).toHaveLength(2);

    const checkingCard = screen.getByRole("article", {
      name: /Everyday Checking/,
    });
    const savingsCard = screen.getByRole("article", {
      name: /Member Savings/,
    });
    expect(
      within(checkingCard).getByText("No recent transactions."),
    ).toBeInTheDocument();
    expect(
      within(savingsCard).getByText("No recent transactions."),
    ).toBeInTheDocument();
  });

  it("distinguishes a successful empty projection from an account balance", () => {
    renderWithRouter(<AccountDashboard dashboard={emptyAccountDashboard} />);

    expect(
      screen.getByText("No accounts are currently available."),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText("0 accounts")).toBeInTheDocument();
    expect(screen.queryByText("$0.00")).not.toBeInTheDocument();
  });

  it("shows masked suffixes without exposing internal account identifiers", () => {
    renderWithRouter(<AccountDashboard dashboard={freshAccountDashboard} />);

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
    renderWithRouter(<AccountDashboard dashboard={freshAccountDashboard} />);

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
    renderWithRouter(<AccountDashboard dashboard={staleAccountDashboard} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Account information may be out of date. This account snapshot could not be refreshed and is based on stale projection data.",
    );
  });

  it("identifies a fresh projection as current without a stale warning", () => {
    renderWithRouter(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Projection is current. This dashboard is based on the latest available projection data.",
    );
    expect(
      screen.queryByText("Balances may be out of date", { exact: false }),
    ).not.toBeInTheDocument();
  });

  it("renders the projection's last-updated value", () => {
    renderWithRouter(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(screen.getByText(/Last updated/)).toHaveTextContent(
      "Jul 31, 2026, 12:00 PM UTC",
    );
  });
});
