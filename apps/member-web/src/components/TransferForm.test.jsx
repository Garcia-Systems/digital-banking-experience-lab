import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { freshAccountDashboard } from "../data/accountDashboardFixtures";
import TransferForm from "./TransferForm";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

const accounts = freshAccountDashboard.accounts;

function renderForm(route = "/transfers/new") {
  function Destination() {
    const location = useLocation();
    return <h1>Route: {location.pathname}</h1>;
  }
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path="/transfers/new"
          element={<TransferForm accounts={accounts} />}
        />
        <Route path="/transfers/:transferId" element={<Destination />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function chooseAccounts(user, source = 0, destination = 1) {
  await user.selectOptions(
    screen.getByLabelText("Source account"),
    accounts[source].id,
  );
  await user.selectOptions(
    screen.getByLabelText("Destination account"),
    accounts[destination].id,
  );
}

async function prepareReview(user) {
  await chooseAccounts(user);
  await user.type(screen.getByLabelText("Amount"), "25.50");
  await user.type(screen.getByLabelText("Memo (optional)"), "Vacation fund");
  await user.click(screen.getByRole("button", { name: "Review" }));
}

const acceptedTransfer = {
  transferId: "TRN-1001",
  status: "accepted",
  confirmationNumber: "HC-0001001",
  submittedAt: "2026-07-31T14:30:00Z",
  idempotencyKey: "member-intent-1",
  duplicate: false,
};

afterEach(() => vi.restoreAllMocks());

describe("transfer form validation", () => {
  it("associates required errors with each required control", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: "Review" }));

    const source = screen.getByLabelText("Source account");
    const destination = screen.getByLabelText("Destination account");
    const amount = screen.getByLabelText("Amount");

    expect(source).toHaveAttribute("aria-invalid", "true");
    expect(source).toHaveAttribute("aria-errormessage", "source-account-error");
    expect(source).toHaveAccessibleErrorMessage("Choose a source account.");
    expect(screen.getByText("Choose a source account.")).toBeVisible();
    expect(destination).toHaveAttribute("aria-invalid", "true");
    expect(destination).toHaveAttribute(
      "aria-errormessage",
      "destination-account-error",
    );
    expect(destination).toHaveAccessibleErrorMessage(
      "Choose a destination account.",
    );
    expect(screen.getByText("Choose a destination account.")).toBeVisible();
    expect(amount).toHaveAttribute("aria-invalid", "true");
    expect(amount).toHaveAttribute(
      "aria-errormessage",
      "transfer-amount-error",
    );
    expect(amount).toHaveAccessibleErrorMessage("Transfer amount is required.");
    expect(screen.getByText("Transfer amount is required.")).toBeVisible();
  });

  it("prevents transfers to the same account", async () => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user, 0, 0);
    await user.type(screen.getByLabelText("Amount"), "10");
    await user.click(screen.getByRole("button", { name: "Review" }));
    const destination = screen.getByLabelText("Destination account");
    expect(destination).toHaveAttribute("aria-invalid", "true");
    expect(destination).toHaveAccessibleErrorMessage(
      "Source and destination accounts must be different.",
    );
    expect(
      screen.getByText("Source and destination accounts must be different."),
    ).toBeVisible();
    expect(screen.getByLabelText("Source account")).not.toHaveAttribute(
      "aria-errormessage",
    );
  });

  it.each(["-1", "0"])("rejects an amount of %s", async (amountValue) => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user);
    const amount = screen.getByLabelText("Amount");
    await user.type(amount, amountValue);
    await user.click(screen.getByRole("button", { name: "Review" }));
    expect(amount).toHaveAttribute("aria-invalid", "true");
    expect(amount).toHaveAccessibleErrorMessage(
      "Transfer amount must be greater than zero.",
    );
    expect(
      screen.getByText("Transfer amount must be greater than zero."),
    ).toBeVisible();
  });

  it("warns when the amount exceeds the fictional available balance", async () => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user);
    await user.type(screen.getByLabelText("Amount"), "1250.01");
    await user.click(screen.getByRole("button", { name: "Review" }));
    const amount = screen.getByLabelText("Amount");
    expect(amount).toHaveAttribute("aria-invalid", "true");
    expect(amount).toHaveAccessibleErrorMessage(
      "Amount cannot exceed the available balance of $1,250.00.",
    );
    expect(
      screen.getByText(
        "Amount cannot exceed the available balance of $1,250.00.",
      ),
    ).toBeVisible();
    expect(screen.getByLabelText("Destination account")).not.toHaveAttribute(
      "aria-errormessage",
    );
  });

  it("enforces the memo length limit", async () => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user);
    await user.type(screen.getByLabelText("Amount"), "20");
    await user.type(screen.getByLabelText("Memo (optional)"), "x".repeat(101));
    await user.click(screen.getByRole("button", { name: "Review" }));
    const memo = screen.getByLabelText("Memo (optional)");
    expect(memo).toHaveAttribute("aria-invalid", "true");
    expect(memo).toHaveAttribute("aria-errormessage", "transfer-memo-error");
    expect(memo).toHaveAccessibleErrorMessage(
      "Memo must be 100 characters or fewer.",
    );
    expect(
      screen.getByText("Memo must be 100 characters or fewer."),
    ).toBeVisible();
    expect(screen.getByLabelText("Amount")).not.toHaveAttribute(
      "aria-errormessage",
    );
  });

  it("removes an error relationship when the member corrects a field", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: "Review" }));
    const amount = screen.getByLabelText("Amount");
    expect(amount).toHaveAccessibleErrorMessage("Transfer amount is required.");

    await user.type(amount, "25");
    expect(amount).toHaveAttribute("aria-invalid", "false");
    expect(amount).not.toHaveAttribute("aria-errormessage");
    expect(
      screen.queryByText("Transfer amount is required."),
    ).not.toBeInTheDocument();
  });

  it("accepts an omitted memo and renders a read-only review summary", async () => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user);
    await user.type(screen.getByLabelText("Amount"), "25.50");
    await user.click(screen.getByRole("button", { name: "Review" }));

    const review = screen.getByRole("region", { name: "Transfer summary" });
    expect(
      within(review).getByText("Everyday Checking (•••• 4821)"),
    ).toBeInTheDocument();
    expect(
      within(review).getByText("Member Savings (•••• 7314)"),
    ).toBeInTheDocument();
    expect(within(review).getByText("$25.50")).toBeInTheDocument();
    expect(within(review).getByText("No memo")).toBeInTheDocument();
    expect(
      within(review).getByText("Ready for submission"),
    ).toBeInTheDocument();
    for (const control of [
      screen.getByLabelText("Source account"),
      screen.getByLabelText("Destination account"),
      screen.getByLabelText("Amount"),
      screen.getByLabelText("Memo (optional)"),
    ]) {
      expect(control).toHaveAttribute("aria-invalid", "false");
      expect(control).not.toHaveAttribute("aria-errormessage");
    }
  });

  it("includes a valid optional memo in a successful review", async () => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user);
    await user.type(screen.getByLabelText("Amount"), "40");
    await user.type(screen.getByLabelText("Memo (optional)"), "Vacation fund");
    await user.click(screen.getByRole("button", { name: "Review" }));
    expect(screen.getByText("Vacation fund")).toBeInTheDocument();
    expect(screen.getByText("Ready for submission")).toBeInTheDocument();
  });

  it("renders HTML-like memo content as ordinary text", async () => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user);
    await user.type(screen.getByLabelText("Amount"), "40");
    await user.type(
      screen.getByLabelText("Memo (optional)"),
      "<strong>Rent & utilities</strong>",
    );
    await user.click(screen.getByRole("button", { name: "Review" }));

    const review = screen.getByRole("region", { name: "Transfer summary" });
    expect(
      within(review).getByText("<strong>Rent & utilities</strong>"),
    ).toBeVisible();
    expect(review.querySelector("strong")).not.toBeInTheDocument();
  });
});

describe("transfer submission", () => {
  it("shows structured server validation errors on the matching fields", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({
        errors: {
          amountCents: ["Transfer amount must be greater than zero."],
          memo: ["Memo must be 100 characters or fewer."],
        },
      }),
    });
    renderForm();
    await prepareReview(user);
    await user.click(screen.getByRole("button", { name: "Submit transfer" }));

    expect(
      await screen.findByText("Transfer amount must be greater than zero."),
    ).toBeVisible();
    expect(screen.getByLabelText("Amount")).toHaveAccessibleErrorMessage(
      "Transfer amount must be greater than zero.",
    );
    expect(
      screen.getByLabelText("Memo (optional)"),
    ).toHaveAccessibleErrorMessage("Memo must be 100 characters or fewer.");
    expect(
      screen.queryByRole("region", { name: "Transfer summary" }),
    ).not.toBeInTheDocument();
  });

  it("disables duplicate clicks while one logical transfer is submitting", async () => {
    const user = userEvent.setup();
    let finishRequest;
    vi.spyOn(globalThis, "fetch").mockImplementation(
      () =>
        new Promise((resolve) => {
          finishRequest = resolve;
        }),
    );
    renderForm();
    await prepareReview(user);
    const submit = screen.getByRole("button", { name: "Submit transfer" });
    await user.click(submit);

    expect(
      screen.getByRole("button", { name: "Submitting transfer..." }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Submitting transfer..." }),
    );
    expect(fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      finishRequest({ ok: true, json: async () => acceptedTransfer });
    });
    expect(
      await screen.findByRole("heading", {
        name: "Route: /transfers/TRN-1001",
      }),
    ).toBeVisible();
  });

  it("posts the instruction and navigates to its transfer resource", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => acceptedTransfer,
    });
    renderForm();
    await prepareReview(user);
    await user.click(screen.getByRole("button", { name: "Submit transfer" }));

    expect(fetch).toHaveBeenCalledWith(
      "/api/transfers",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body).toEqual(
      expect.objectContaining({
        sourceAccount: "account-2001",
        destinationAccount: "account-2002",
        amountCents: 2550,
        memo: "Vacation fund",
        idempotencyKey: expect.any(String),
      }),
    );
    expect(
      await screen.findByRole("heading", {
        name: "Route: /transfers/TRN-1001",
      }),
    ).toBeVisible();
  });

  it("navigates to the original resource returned for a duplicate", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ ...acceptedTransfer, duplicate: true }),
    });
    renderForm();
    await prepareReview(user);
    await user.click(screen.getByRole("button", { name: "Submit transfer" }));
    expect(
      await screen.findByRole("heading", {
        name: "Route: /transfers/TRN-1001",
      }),
    ).toBeVisible();
  });

  it("keeps the reviewed instruction retryable when transfers are unavailable", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({
        error: { message: "Transfers are temporarily unavailable." },
      }),
    });
    renderForm("/transfers/new?transferScenario=unavailable");
    await prepareReview(user);
    await user.click(screen.getByRole("button", { name: "Submit transfer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Transfers are temporarily unavailable",
    );
    expect(
      screen.getByRole("button", { name: "Submit transfer" }),
    ).toBeEnabled();
    expect(fetch).toHaveBeenCalledWith(
      "/api/transfers?scenario=unavailable",
      expect.objectContaining({ method: "POST" }),
    );
    const firstBody = JSON.parse(fetch.mock.calls[0][1].body);

    await user.click(screen.getByRole("button", { name: "Submit transfer" }));

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[1][0]).toBe("/api/transfers?scenario=unavailable");
    const retryBody = JSON.parse(fetch.mock.calls[1][1].body);
    expect(retryBody.idempotencyKey).toBe(firstBody.idempotencyKey);
  });

  it("does not forward an unsupported laboratory scenario", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => acceptedTransfer,
    });
    renderForm("/transfers/new?transferScenario=internal-service-name");
    await prepareReview(user);
    await user.click(screen.getByRole("button", { name: "Submit transfer" }));

    expect(fetch).toHaveBeenCalledWith(
      "/api/transfers",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
