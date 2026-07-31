import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { freshAccountDashboard } from "../data/accountDashboardFixtures";
import AccountDashboard from "./AccountDashboard";

function getAccountCard(name) {
  return screen.getByRole("article", { name: new RegExp(name) });
}

describe("local card lock simulation", () => {
  it("changes an unlocked card to locked through member interaction", async () => {
    const user = userEvent.setup();
    render(<AccountDashboard dashboard={freshAccountDashboard} />);
    const checkingCard = getAccountCard("Everyday Checking");

    expect(within(checkingCard).getByText("Card unlocked")).toBeInTheDocument();

    await user.click(
      within(checkingCard).getByRole("button", {
        name: "Lock card for Everyday Checking",
      }),
    );

    expect(within(checkingCard).getByText("Card locked")).toBeInTheDocument();
    expect(
      within(checkingCard).getByRole("button", {
        name: "Unlock card for Everyday Checking",
      }),
    ).toBeInTheDocument();
  });

  it("changes a locked card back to unlocked", async () => {
    const user = userEvent.setup();
    render(<AccountDashboard dashboard={freshAccountDashboard} />);
    const checkingCard = getAccountCard("Everyday Checking");
    const lockButton = within(checkingCard).getByRole("button", {
      name: "Lock card for Everyday Checking",
    });

    await user.click(lockButton);
    await user.click(
      within(checkingCard).getByRole("button", {
        name: "Unlock card for Everyday Checking",
      }),
    );

    expect(within(checkingCard).getByText("Card unlocked")).toBeInTheDocument();
  });

  it("keeps card state local to one account", async () => {
    const user = userEvent.setup();
    render(<AccountDashboard dashboard={freshAccountDashboard} />);
    const checkingCard = getAccountCard("Everyday Checking");
    const savingsCard = getAccountCard("Member Savings");

    await user.click(
      within(checkingCard).getByRole("button", {
        name: "Lock card for Everyday Checking",
      }),
    );

    expect(within(checkingCard).getByText("Card locked")).toBeInTheDocument();
    expect(within(savingsCard).getByText("Card unlocked")).toBeInTheDocument();
  });

  it("preserves projection freshness and account metadata after a state update", async () => {
    const user = userEvent.setup();
    render(<AccountDashboard dashboard={freshAccountDashboard} />);
    const checkingCard = getAccountCard("Everyday Checking");

    await user.click(
      within(checkingCard).getByRole("button", {
        name: "Lock card for Everyday Checking",
      }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Projection is current",
    );
    expect(
      within(checkingCard).getByText("Daily Spending"),
    ).toBeInTheDocument();
    expect(within(checkingCard).getByText("Individual")).toBeInTheDocument();
    expect(
      within(checkingCard).getByLabelText("Account ending in 4821"),
    ).toHaveTextContent("•••• 4821");
    expect(
      within(checkingCard).getByText("Available balance").parentElement,
    ).toHaveTextContent("$1,250.00");
  });

  it("always explains that the control is only a simulation", () => {
    render(<AccountDashboard dashboard={freshAccountDashboard} />);

    expect(
      screen.getAllByText(
        "Simulation only — no banking system has been updated.",
      ),
    ).toHaveLength(2);
  });
});
