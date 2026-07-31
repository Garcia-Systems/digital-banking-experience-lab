import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { freshAccountDashboard } from "./data/accountDashboardFixtures";

const response = {
  ok: true,
  json: () => Promise.resolve(freshAccountDashboard),
};

describe("member application routes", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response)));
  afterEach(() => {
    vi.unstubAllGlobals();
    window.history.replaceState({}, "", "/");
  });

  it("renders dashboard navigation and projection status", async () => {
    render(<App />);
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
    render(<App />);
    await user.click(await screen.findByRole("link", { name: "View account" }));
    expect(
      screen.getByRole("heading", { name: "Everyday Checking", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("•••• 4821")).toBeInTheDocument();
    expect(screen.getByText("Projection is current.")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("renders the account identified directly by its route", async () => {
    window.history.replaceState({}, "", "/accounts/account-2002");
    render(<App />);
    expect(
      await screen.findByRole("heading", { name: "Member Savings", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("•••• 7314")).toBeInTheDocument();
  });

  it("shows a safe message for an unknown account", async () => {
    window.history.replaceState({}, "", "/accounts/not-real");
    render(<App />);
    expect(
      await screen.findByRole("heading", { name: "Account not found." }),
    ).toBeInTheDocument();
  });

  it("navigates to member settings", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("link", { name: "Settings" }));
    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Secure message")).toBeInTheDocument();
  });

  it("shows a friendly page for an unknown route", async () => {
    window.history.replaceState({}, "", "/something-unknown");
    render(<App />);
    expect(
      await screen.findByRole("heading", { name: "We can’t find that page." }),
    ).toBeInTheDocument();
  });
});
