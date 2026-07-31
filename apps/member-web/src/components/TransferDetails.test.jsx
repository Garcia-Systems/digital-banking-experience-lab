import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import TransferDetails from "./TransferDetails";
import { renderWithRouter } from "../test/renderWithRouter";

const transfer = {
  transferId: "TRN-1001",
  confirmationNumber: "HC-0001001",
  sourceAccount: {
    id: "account-2001",
    displayName: "Everyday Checking",
    accountSuffix: "4821",
  },
  destinationAccount: {
    id: "account-2002",
    displayName: "Member Savings",
    accountSuffix: "7314",
  },
  amountCents: 25000,
  memo: "Vacation fund",
  status: "accepted",
  submittedAt: "2026-07-31T14:30:00Z",
};

function DetailRoutes() {
  return (
    <Routes>
      <Route path="/transfers/:transferId" element={<TransferDetails />} />
      <Route path="/" element={<h1>Member dashboard</h1>} />
      <Route path="/transfers/new" element={<h1>Prepare a transfer</h1>} />
    </Routes>
  );
}

function renderDetails(payload = transfer, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok, json: async () => payload }),
  );
  renderWithRouter(<DetailRoutes />, { route: "/transfers/TRN-1001" });
}

afterEach(() => vi.unstubAllGlobals());

describe("transfer details", () => {
  it("renders the transfer resource and navigation", async () => {
    renderDetails();
    const confirmation = await screen.findByRole("region", {
      name: "Transfer confirmation",
    });
    expect(within(confirmation).getByText("HC-0001001")).toBeVisible();
    expect(within(confirmation).getByText("$250.00")).toBeVisible();
    expect(within(confirmation).getByText("Vacation fund")).toBeVisible();
    expect(
      within(confirmation).getByText("Everyday Checking (•••• 4821)"),
    ).toBeVisible();
    expect(
      within(confirmation).getByText("Member Savings (•••• 7314)"),
    ).toBeVisible();
    expect(
      within(confirmation).getByText("Jul 31, 2026, 2:30 PM UTC"),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Return to dashboard" }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", { name: "Make another transfer" }),
    ).toHaveAttribute("href", "/transfers/new");
  });

  it.each([
    [
      "accepted",
      "Your transfer request has been accepted and is awaiting processing.",
    ],
    ["completed", "Your transfer has completed successfully."],
    ["rejected", "This transfer could not be completed."],
  ])("explains the %s status in text", async (status, note) => {
    renderDetails({ ...transfer, status });
    expect(
      await screen.findByRole("status", {
        name: `Transfer status: ${status}`,
      }),
    ).toBeVisible();
    expect(screen.getByText(note)).toBeVisible();
  });

  it("returns to the dashboard through the member-facing link", async () => {
    const user = userEvent.setup();
    renderDetails();
    await user.click(
      await screen.findByRole("link", { name: "Return to dashboard" }),
    );
    expect(
      screen.getByRole("heading", { name: "Member dashboard" }),
    ).toBeVisible();
  });

  it("starts another transfer through the member-facing link", async () => {
    const user = userEvent.setup();
    renderDetails();
    await user.click(
      await screen.findByRole("link", { name: "Make another transfer" }),
    );
    expect(
      screen.getByRole("heading", { name: "Prepare a transfer" }),
    ).toBeVisible();
  });

  it("shows a friendly message for an unknown transfer", async () => {
    renderDetails(
      {
        error: {
          code: "transfer_not_found",
          message: "Internal lookup diagnostic must remain private.",
        },
      },
      false,
    );
    expect(
      await screen.findByRole("heading", { name: "Transfer not found." }),
    ).toBeVisible();
    expect(screen.getByText(/may no longer be available/)).toBeVisible();
    expect(
      screen.queryByText(/internal lookup diagnostic/i),
    ).not.toBeInTheDocument();
  });
});
