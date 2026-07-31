import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import TransferDetails from "./TransferDetails";

const transfer = {
  transferId: "TRN-1001",
  confirmationNumber: "HC-0001001",
  sourceAccount: "CHK-4821",
  destinationAccount: "SAV-7314",
  amountCents: 2550,
  memo: "Vacation fund",
  status: "accepted",
  submittedAt: "2026-07-31T14:30:00Z",
};

function renderDetails(payload = transfer, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok, json: async () => payload }),
  );
  render(
    <MemoryRouter initialEntries={["/transfers/TRN-1001"]}>
      <Routes>
        <Route path="/transfers/:transferId" element={<TransferDetails />} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("transfer details", () => {
  it("renders the transfer resource and navigation", async () => {
    renderDetails();
    const confirmation = await screen.findByRole("region", {
      name: "Transfer confirmation",
    });
    expect(within(confirmation).getByText("HC-0001001")).toBeVisible();
    expect(within(confirmation).getByText("$25.50")).toBeVisible();
    expect(within(confirmation).getByText("Vacation fund")).toBeVisible();
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
    expect(await screen.findByText(`Status: ${status}`)).toBeVisible();
    expect(screen.getByText(note)).toBeVisible();
  });

  it("shows a friendly message for an unknown transfer", async () => {
    renderDetails({}, false);
    expect(
      await screen.findByRole("heading", { name: "Transfer not found." }),
    ).toBeVisible();
    expect(screen.getByText(/may no longer be available/)).toBeVisible();
  });
});
