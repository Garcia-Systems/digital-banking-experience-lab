import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { freshAccountDashboard } from "./data/accountDashboardFixtures";
import { renderWithRouter } from "./test/renderWithRouter";

const session = {
  authenticated: true,
  memberId: "member-1001",
  displayName: "Alex Morgan",
  expiresAt: "2026-08-01T12:00:00Z",
};
const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});

function mockAuthenticated() {
  vi.stubGlobal(
    "fetch",
    vi.fn((url) =>
      Promise.resolve(
        url === "/api/session"
          ? response(session)
          : response(freshAccountDashboard),
      ),
    ),
  );
}

describe("authentication boundaries", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("completes a successful laboratory login and loads the dashboard", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url === "/api/session")
          return Promise.resolve(response({ authenticated: false }, 401));
        if (url === "/api/login") return Promise.resolve(response(session));
        return Promise.resolve(response(freshAccountDashboard));
      }),
    );
    renderWithRouter(<App />, { route: "/login" });
    await user.click(await screen.findByRole("button", { name: "Sign in" }));
    expect(
      await screen.findByRole("heading", { name: /Alex Morgan/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("Signed in as Alex Morgan")).toBeInTheDocument();
  });

  it("shows a safe failed-login message", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn((url) =>
        Promise.resolve(
          url === "/api/session"
            ? response({ authenticated: false }, 401)
            : response({}, 401),
        ),
      ),
    );
    renderWithRouter(<App />, { route: "/login" });
    await user.clear(await screen.findByLabelText("Password"));
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "credentials were not recognized",
    );
  });

  it("logs out and removes protected information", async () => {
    const user = userEvent.setup();
    mockAuthenticated();
    renderWithRouter(<App />);
    await user.click(await screen.findByRole("button", { name: "Logout" }));
    expect(
      await screen.findByRole("heading", { name: "Member login" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /Welcome, Alex Morgan/ }),
    ).not.toBeInTheDocument();
  });

  it("redirects a protected route to login", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(response({ authenticated: false }, 401))),
    );
    renderWithRouter(<App />, { route: "/accounts/account-2001" });
    expect(
      await screen.findByRole("heading", { name: "Member login" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Everyday Checking")).not.toBeInTheDocument();
  });

  it("treats an expired initial session as anonymous", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(response({ authenticated: false }, 401))),
    );
    renderWithRouter(<App />, { route: "/transfers/new" });
    expect(
      await screen.findByRole("heading", { name: "Member login" }),
    ).toBeInTheDocument();
  });

  it("clears protected UI after an unauthorized API response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) =>
        Promise.resolve(
          url === "/api/session" ? response(session) : response({}, 401),
        ),
      ),
    );
    renderWithRouter(<App />);
    expect(
      await screen.findByText(
        "Your session has expired. Please sign in again.",
      ),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Everyday Checking")).not.toBeInTheDocument(),
    );
  });
});
