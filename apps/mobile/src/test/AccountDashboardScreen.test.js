import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import AccountDashboardScreen from "../screens/AccountDashboardScreen";

const dashboard = {
  member: { id: "member-1001", displayName: "Alex Morgan" },
  projection: { generatedAt: "2026-07-31T12:00:00Z", isStale: false },
  accounts: [
    {
      id: "account-2001",
      type: "checking",
      status: "open",
      displayName: "Everyday Checking",
      accountSuffix: "4821",
      availableBalanceCents: 125000,
      currentBalanceCents: 130500,
    },
    {
      id: "account-2002",
      type: "savings",
      status: "dormant",
      displayName: "Member Savings",
      accountSuffix: "7314",
      availableBalanceCents: 420000,
      currentBalanceCents: 420000,
    },
  ],
};

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("mobile account dashboard", () => {
  it("renders the institution, fictional member, accounts, masked suffixes, and formatted cents", async () => {
    render(
      <AccountDashboardScreen
        loadDashboard={() => Promise.resolve(dashboard)}
      />,
    );
    expect(
      await screen.findByText("Harbor Community Credit Union"),
    ).toBeTruthy();
    expect(screen.getByText("Good afternoon, Alex Morgan")).toBeTruthy();
    expect(screen.getByText("Everyday Checking")).toBeTruthy();
    expect(screen.getByText("Member Savings")).toBeTruthy();
    expect(screen.getByText("checking · •••• 4821")).toBeTruthy();
    expect(screen.getByText("savings · •••• 7314")).toBeTruthy();
    expect(screen.getByText("$1,250.00")).toBeTruthy();
    expect(screen.getByText("Current balance $1,305.00")).toBeTruthy();
    expect(screen.queryByText("account-2001")).toBeNull();
    expect(screen.queryByText("account-2002")).toBeNull();
  });

  it("shows accessible loading copy until success replaces it", async () => {
    const request = deferred();
    render(<AccountDashboardScreen loadDashboard={() => request.promise} />);
    expect(screen.getByText("Loading account information…")).toBeTruthy();
    expect(screen.getByLabelText("Loading account information")).toBeTruthy();
    request.resolve(dashboard);
    expect(await screen.findByText("Everyday Checking")).toBeTruthy();
    expect(screen.queryByText("Loading account information…")).toBeNull();
  });

  it("shows an empty success without inventing an account", async () => {
    render(
      <AccountDashboardScreen
        loadDashboard={() => Promise.resolve({ ...dashboard, accounts: [] })}
      />,
    );
    expect(
      await screen.findByText("No accounts are currently available."),
    ).toBeTruthy();
    expect(screen.queryByText("$0.00")).toBeNull();
  });

  it("keeps stale accounts visible with a textual warning and deterministic update time", async () => {
    const stale = {
      ...dashboard,
      projection: { generatedAt: "2026-07-31T10:15:00Z", isStale: true },
    };
    render(
      <AccountDashboardScreen loadDashboard={() => Promise.resolve(stale)} />,
    );
    expect(
      await screen.findByText("Account information may be out of date."),
    ).toBeTruthy();
    expect(screen.getByText("Everyday Checking")).toBeTruthy();
    expect(
      screen.getByText("Last updated Jul 31, 2026, 10:15 AM UTC"),
    ).toBeTruthy();
  });

  it("presents a safe failure and retries only the dashboard request", async () => {
    const loadDashboard = jest
      .fn()
      .mockRejectedValueOnce(new Error("unavailable"))
      .mockResolvedValueOnce(dashboard);
    render(<AccountDashboardScreen loadDashboard={loadDashboard} />);
    expect(
      await screen.findByText("We could not load your account information."),
    ).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Try Again" }));
    expect(await screen.findByText("Everyday Checking")).toBeTruthy();
    expect(loadDashboard).toHaveBeenCalledTimes(2);
  });

  it("prevents duplicate retry requests while a retry is active", async () => {
    const retry = deferred();
    const loadDashboard = jest
      .fn()
      .mockRejectedValueOnce(new Error("unavailable"))
      .mockReturnValueOnce(retry.promise);
    render(<AccountDashboardScreen loadDashboard={loadDashboard} />);
    const button = await screen.findByRole("button", { name: "Try Again" });
    fireEvent.press(button);
    fireEvent.press(button);
    expect(loadDashboard).toHaveBeenCalledTimes(2);
    retry.resolve(dashboard);
    await waitFor(() =>
      expect(screen.getByText("Everyday Checking")).toBeTruthy(),
    );
  });

  it("fails safely when the API client rejects a malformed response", async () => {
    render(
      <AccountDashboardScreen
        loadDashboard={() =>
          Promise.reject(new Error("invalid_dashboard_contract"))
        }
      />,
    );
    expect(
      await screen.findByText("We could not load your account information."),
    ).toBeTruthy();
    expect(screen.queryByText("$0.00")).toBeNull();
  });
});
