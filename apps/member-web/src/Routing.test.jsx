import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { freshAccountDashboard } from "./data/accountDashboardFixtures";
import { renderWithRouter } from "./test/renderWithRouter";

const authenticatedSession = {
  authenticated: true,
  memberId: "member-1001",
  displayName: "Alex Morgan",
  expiresAt: "2026-08-01T12:00:00Z",
};

function jsonResponse(body) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  };
}

function requestDetails([input, options = {}]) {
  return {
    url: typeof input === "string" ? input : input.url,
    method: options.method ?? "GET",
  };
}

function requestsForPath(path) {
  return fetch.mock.calls
    .map(requestDetails)
    .filter(({ url }) => url.includes(path));
}

describe("member application routes", () => {
  beforeEach(() =>
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input, options = {}) => {
        const { url, method } = requestDetails([input, options]);

        if (url.includes("/api/session") && method === "GET")
          return jsonResponse(authenticatedSession);
        if (url.includes("/api/dashboard") && method === "GET")
          return jsonResponse(freshAccountDashboard);

        throw new Error(`Unexpected request: ${method} ${url}`);
      }),
    ),
  );
  afterEach(() => {
    vi.unstubAllGlobals();
    window.history.replaceState({}, "", "/");
  });

  it("renders dashboard navigation and projection status", async () => {
    renderWithRouter(<App />, { route: "/" });
    expect(
      await screen.findByRole("heading", { name: /Alex Morgan/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings",
    );
    expect(screen.getByText("Projection is current.")).toBeInTheDocument();
  });

  it("selects an account from the route parameter and preserves loaded state", async () => {
    const user = userEvent.setup();
    renderWithRouter(<App />, { route: "/" });
    const checkingCard = await screen.findByRole("article", {
      name: /everyday checking, checking account/i,
    });
    await user.click(
      within(checkingCard).getByRole("link", { name: "View account" }),
    );
    expect(
      screen.getByRole("heading", { name: "Everyday Checking", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("•••• 4821")).toBeInTheDocument();
    expect(screen.getByText("Projection is current.")).toBeInTheDocument();
    expect(requestsForPath("/api/session")).toEqual([
      { url: "/api/session", method: "GET" },
    ]);
    expect(requestsForPath("/api/dashboard")).toEqual([
      { url: "/api/dashboard?scenario=success", method: "GET" },
    ]);
  });

  it("renders the account identified directly by its route", async () => {
    renderWithRouter(<App />, { route: "/accounts/account-2002" });
    expect(
      await screen.findByRole("heading", { name: "Member Savings", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("•••• 7314")).toBeInTheDocument();
  });

  it("shows a safe message for an unknown account", async () => {
    renderWithRouter(<App />, { route: "/accounts/not-real" });
    expect(
      await screen.findByRole("heading", { name: "Account not found." }),
    ).toBeInTheDocument();
  });

  it("renders member settings at its route", async () => {
    renderWithRouter(<App />, { route: "/settings" });
    expect(
      await screen.findByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Secure message")).toBeInTheDocument();
  });

  it("shows a friendly page for an unknown route", async () => {
    renderWithRouter(<App />, { route: "/something-unknown" });
    expect(
      await screen.findByRole("heading", { name: "We can’t find that page." }),
    ).toBeInTheDocument();
  });
});
