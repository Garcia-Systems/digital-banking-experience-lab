import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { MobileAppContent } from "../MobileApp";
import { clearLaboratorySessionToken } from "../api/session";
import { renderWithSafeArea } from "./renderWithSafeArea";

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
      transactions: [],
    },
  ],
};

function response(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  };
}

function installApi({
  invalidLogin = false,
  expireDashboard = false,
  pendingLogin = false,
} = {}) {
  let resolveLogin;
  const loginWait = pendingLogin
    ? new Promise((resolve) => {
        resolveLogin = resolve;
      })
    : null;
  const mock = jest
    .spyOn(global, "fetch")
    .mockImplementation(async (url, options = {}) => {
      const endpoint = new URL(url).pathname;
      const method = options.method || "GET";
      if (endpoint === "/api/login" && method === "POST") {
        if (loginWait) await loginWait;
        return invalidLogin
          ? response(401, { error: { code: "invalid_credentials" } })
          : response(200, {
              authenticated: true,
              memberId: "member-1001",
              laboratorySessionToken: "lab-session-member-1001",
            });
      }
      if (endpoint === "/api/dashboard" && method === "GET") {
        return expireDashboard
          ? response(401, { error: { code: "unauthorized" } })
          : response(200, dashboard);
      }
      if (endpoint === "/api/logout" && method === "POST")
        return response(200, { authenticated: false });
      throw new Error(`Unexpected request: ${method} ${endpoint}`);
    });
  return { mock, resolveLogin };
}

describe("mobile session boundary", () => {
  beforeEach(() => clearLaboratorySessionToken());
  afterEach(() => jest.restoreAllMocks());

  it("starts signed out and never exposes protected dashboard data", async () => {
    installApi();
    renderWithSafeArea(<MobileAppContent />);
    expect(
      await screen.findByRole("header", { name: "Mobile member sign in" }),
    ).toBeTruthy();
    expect(screen.queryByText("Everyday Checking")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows loading during sign in and then loads the protected dashboard", async () => {
    const api = installApi({ pendingLogin: true });
    renderWithSafeArea(<MobileAppContent />);
    fireEvent.press(await screen.findByRole("button", { name: "Sign in" }));
    expect(screen.getByLabelText("Signing in")).toBeTruthy();
    await act(async () => api.resolveLogin());
    expect(await screen.findByText("Everyday Checking")).toBeTruthy();
    expect(
      api.mock.mock.calls.map(([url, options = {}]) => [
        new URL(url).pathname,
        options.method || "GET",
      ]),
    ).toEqual([
      ["/api/login", "POST"],
      ["/api/dashboard", "GET"],
    ]);
  });

  it("shows a safe invalid-credentials error without protected content", async () => {
    installApi({ invalidLogin: true });
    renderWithSafeArea(<MobileAppContent />);
    fireEvent.changeText(await screen.findByLabelText("Password"), "wrong");
    fireEvent.press(screen.getByRole("button", { name: "Sign in" }));
    expect(
      await screen.findByText(
        "The laboratory credentials were not recognized.",
      ),
    ).toBeTruthy();
    expect(screen.queryByText("Everyday Checking")).toBeNull();
  });

  it("returns to sign in with expiration wording when dashboard authorization expires", async () => {
    installApi({ expireDashboard: true });
    renderWithSafeArea(<MobileAppContent />);
    fireEvent.press(await screen.findByRole("button", { name: "Sign in" }));
    expect(
      await screen.findByText(
        "Your session has expired. Please sign in again.",
      ),
    ).toBeTruthy();
    expect(screen.queryByText("Everyday Checking")).toBeNull();
  });

  it("logs out, clears protected content, and permits signing in again", async () => {
    installApi();
    renderWithSafeArea(<MobileAppContent />);
    fireEvent.press(await screen.findByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Everyday Checking")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Sign out" }));
    expect(await screen.findByText("You have signed out.")).toBeTruthy();
    expect(screen.queryByText("Everyday Checking")).toBeNull();
    fireEvent.press(screen.getByRole("button", { name: "Sign in" }));
    await waitFor(() =>
      expect(screen.getByText("Everyday Checking")).toBeTruthy(),
    );
  });
});
