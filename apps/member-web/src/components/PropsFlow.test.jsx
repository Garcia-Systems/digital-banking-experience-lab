import { screen, within } from "@testing-library/react";
import { renderWithRouter } from "../test/renderWithRouter";
import { describe, expect, it } from "vitest";
import { freshAccountDashboard } from "../data/accountDashboardFixtures";
import AccountCard from "./AccountCard";
import BalanceSummary from "./BalanceSummary";
import ProjectionStatus from "./ProjectionStatus";

const [checkingAccount, savingsAccount] = freshAccountDashboard.accounts;

describe("prop-driven account presentation", () => {
  it("renders nickname and ownership supplied by each account", () => {
    renderWithRouter(<AccountCard account={savingsAccount} />);

    expect(screen.getByText("Vacation Savings")).toBeInTheDocument();
    expect(screen.getByText("Joint")).toBeInTheDocument();
  });

  it("changes dividend language according to account data", () => {
    const { rerender } = renderWithRouter(
      <AccountCard account={checkingAccount} />,
    );
    expect(screen.getByText("No dividends")).toBeInTheDocument();

    rerender(<AccountCard account={savingsAccount} />);
    expect(screen.getByText("Earns dividends")).toBeInTheDocument();
    expect(screen.queryByText("No dividends")).not.toBeInTheDocument();
  });

  it("renders AccountCard from account data without a dashboard", () => {
    renderWithRouter(<AccountCard account={checkingAccount} />);

    expect(
      screen.getByRole("article", { name: /Everyday Checking/ }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Alex Morgan")).not.toBeInTheDocument();
  });

  it("renders BalanceSummary from balance values alone", () => {
    renderWithRouter(
      <BalanceSummary
        availableBalanceCents={12345}
        currentBalanceCents={13000}
      />,
    );

    expect(
      screen.getByText("Available balance").parentElement,
    ).toHaveTextContent("$123.45");
    expect(screen.getByText("Current balance").parentElement).toHaveTextContent(
      "$130.00",
    );
  });

  it("renders ProjectionStatus independently of account information", () => {
    renderWithRouter(
      <ProjectionStatus
        projection={{ generatedAt: "2026-07-31T09:30:00Z", isStale: false }}
      />,
    );

    const snapshot = screen.getByRole("region", { name: "Account snapshot" });
    expect(within(snapshot).getByRole("status")).toHaveTextContent(
      "Projection is current",
    );
    expect(snapshot).toHaveTextContent("Jul 31, 2026, 9:30 AM UTC");
  });
});
