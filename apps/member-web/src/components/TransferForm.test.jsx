import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { freshAccountDashboard } from "../data/accountDashboardFixtures";
import { renderWithRouter } from "../test/renderWithRouter";
import TransferForm from "./TransferForm";

const accounts = freshAccountDashboard.accounts;

function renderForm() {
  return renderWithRouter(<TransferForm accounts={accounts} />);
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

describe("transfer form validation", () => {
  it("associates required errors with each required control", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: "Review" }));

    expect(
      screen.getByLabelText("Source account"),
    ).toHaveAccessibleErrorMessage("Choose a source account.");
    expect(
      screen.getByLabelText("Destination account"),
    ).toHaveAccessibleErrorMessage("Choose a destination account.");
    expect(screen.getByLabelText("Amount")).toHaveAccessibleErrorMessage(
      "Enter a transfer amount.",
    );
  });

  it("prevents transfers to the same account", async () => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user, 0, 0);
    await user.type(screen.getByLabelText("Amount"), "10");
    await user.click(screen.getByRole("button", { name: "Review" }));
    expect(
      screen.getByLabelText("Destination account"),
    ).toHaveAccessibleErrorMessage(
      "Source and destination accounts must be different.",
    );
  });

  it.each([
    ["-1", "Transfer amount must be positive."],
    ["0", "Transfer amount must be greater than zero."],
  ])("rejects an amount of %s", async (amount, message) => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user);
    await user.type(screen.getByLabelText("Amount"), amount);
    await user.click(screen.getByRole("button", { name: "Review" }));
    expect(screen.getByLabelText("Amount")).toHaveAccessibleErrorMessage(
      message,
    );
  });

  it("warns when the amount exceeds the fictional available balance", async () => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user);
    await user.type(screen.getByLabelText("Amount"), "1250.01");
    await user.click(screen.getByRole("button", { name: "Review" }));
    expect(screen.getByLabelText("Amount")).toHaveAccessibleErrorMessage(
      "Amount cannot exceed the available balance of $1,250.00.",
    );
  });

  it("enforces the memo length limit", async () => {
    const user = userEvent.setup();
    renderForm();
    await chooseAccounts(user);
    await user.type(screen.getByLabelText("Amount"), "20");
    await user.type(screen.getByLabelText("Memo (optional)"), "x".repeat(101));
    await user.click(screen.getByRole("button", { name: "Review" }));
    expect(
      screen.getByLabelText("Memo (optional)"),
    ).toHaveAccessibleErrorMessage("Memo must be 100 characters or fewer.");
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
});
