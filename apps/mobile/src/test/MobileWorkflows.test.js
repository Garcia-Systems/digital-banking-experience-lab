import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import AccountDashboardScreen from "../screens/AccountDashboardScreen";
import TransactionHistoryScreen from "../screens/TransactionHistoryScreen";
import TransferPreparationScreen from "../screens/TransferPreparationScreen";
import { renderWithSafeArea } from "./renderWithSafeArea";

const accounts = [
  {
    id: "checking",
    displayName: "Everyday Checking",
    nickname: "Daily Spending",
    type: "checking",
    status: "open",
    accountSuffix: "4821",
    availableBalanceCents: 125000,
    currentBalanceCents: 130500,
    transactions: [
      {
        description: "Harbor Market",
        amountCents: -7452,
        type: "card purchase",
        postedAt: "2026-07-30",
      },
    ],
  },
  {
    id: "savings",
    displayName: "Member Savings",
    nickname: "Vacation Savings",
    type: "savings",
    status: "open",
    accountSuffix: "7314",
    availableBalanceCents: 420000,
    currentBalanceCents: 420000,
    transactions: [],
  },
];
const projection = { generatedAt: "2026-07-31T10:15:00Z", isStale: true };
const dashboard = {
  member: { displayName: "Alex Morgan" },
  projection,
  accounts,
};

describe("mobile banking workflows", () => {
  it("navigates from an accessible dashboard account action", async () => {
    const onSelectAccount = jest.fn();
    renderWithSafeArea(
      <AccountDashboardScreen
        loadDashboard={() => Promise.resolve(dashboard)}
        onSelectAccount={onSelectAccount}
      />,
    );
    fireEvent.press(
      await screen.findByRole("button", { name: /Everyday Checking/ }),
    );
    expect(onSelectAccount).toHaveBeenCalledWith(accounts[0]);
  });

  it("renders transaction fields and a stale projection warning", async () => {
    renderWithSafeArea(
      <TransactionHistoryScreen
        account={accounts[0]}
        projection={projection}
        onBack={jest.fn()}
      />,
    );
    expect(await screen.findByText("Harbor Market")).toBeTruthy();
    expect(screen.getByText("card purchase · 2026-07-30")).toBeTruthy();
    expect(screen.getByText("-$74.52")).toBeTruthy();
    expect(
      screen.getByText("Account information may be out of date."),
    ).toBeTruthy();
  });

  it("supports loading, empty, and failure history states", async () => {
    let resolve;
    const pending = new Promise((next) => {
      resolve = next;
    });
    const view = renderWithSafeArea(
      <TransactionHistoryScreen
        account={accounts[1]}
        projection={{ ...projection, isStale: false }}
        loadHistory={() => pending}
        onBack={jest.fn()}
      />,
    );
    expect(screen.getByText("Loading transaction history…")).toBeTruthy();
    await act(async () => {
      resolve([]);
      await pending;
    });
    expect(
      await screen.findByText(
        "No transactions are available for this account.",
      ),
    ).toBeTruthy();
    view.unmount();
    renderWithSafeArea(
      <TransactionHistoryScreen
        account={accounts[1]}
        projection={projection}
        loadHistory={() => Promise.reject(new Error("unavailable"))}
        onBack={jest.fn()}
      />,
    );
    expect(
      await screen.findByText("We could not load transaction history."),
    ).toBeTruthy();
  });

  it("validates transfer preparation and displays a non-submitting review", async () => {
    renderWithSafeArea(
      <TransferPreparationScreen accounts={accounts} onBack={jest.fn()} />,
    );
    fireEvent.press(screen.getByRole("button", { name: "Review transfer" }));
    expect(screen.getByText("Choose a source account.")).toBeTruthy();
    expect(screen.getByText("Choose a destination account.")).toBeTruthy();
    expect(screen.getByText(/Enter a positive amount/)).toBeTruthy();

    const radios = screen.getAllByRole("radio");
    fireEvent.press(radios[0]);
    fireEvent.press(radios[3]);
    fireEvent.changeText(screen.getByLabelText("Amount"), "125.50");
    fireEvent.changeText(screen.getByLabelText("Memo"), "Vacation fund");
    fireEvent.press(screen.getByRole("button", { name: "Review transfer" }));
    await waitFor(() =>
      expect(screen.getByLabelText("Transfer review summary")).toBeTruthy(),
    );
    expect(screen.getByText("Amount: $125.50")).toBeTruthy();
    expect(screen.getByText("Memo: Vacation fund")).toBeTruthy();
    expect(screen.getByText(/has not been submitted/)).toBeTruthy();
  });
});
