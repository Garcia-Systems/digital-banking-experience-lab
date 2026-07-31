import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  emptyAccountDashboard,
  freshAccountDashboard,
  staleAccountDashboard,
} from "./data/accountDashboardFixtures";
import App from "./App";

const response = (body, ok = true) => ({
  ok,
  json: () => Promise.resolve(body),
});

describe("dashboard request states", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.history.replaceState({}, "", "/");
  });

  it("shows only loading information while the request is pending", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    render(<App />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading account information…",
    );
    expect(
      screen.queryByRole("heading", { name: "Everyday Checking" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/No accounts/)).not.toBeInTheDocument();
  });

  it("renders a successful deterministic dashboard", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(response(freshAccountDashboard)),
    );
    render(<App />);

    expect(
      await screen.findByRole("heading", { name: /Alex Morgan/ }),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/dashboard?scenario=success");
    expect(
      screen.getByRole("heading", { name: "Everyday Checking" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Jul 31, 2026, 12:00 PM UTC")).toBeInTheDocument();
  });

  it("renders empty success as neither an error nor a zero balance", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(response(emptyAccountDashboard)),
    );
    render(<App />);

    expect(
      await screen.findByText("No accounts are currently available."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText("$0.00")).not.toBeInTheDocument();
  });

  it("keeps stale accounts usable and displays their warning and timestamp", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(response(staleAccountDashboard)),
    );
    render(<App />);

    expect(
      await screen.findByText("Account information may be out of date."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Everyday Checking" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Jul 31, 2026, 10:15 AM UTC")).toBeInTheDocument();
  });

  it("shows a safe failure without internal response details", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          response({ error: { message: "SQL service exploded" } }, false),
        ),
    );
    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We could not load your account information.",
    );
    expect(screen.queryByText(/SQL service exploded/)).not.toBeInTheDocument();
  });

  it("rejects an invalid HTTP-200 response safely", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(response({ member: freshAccountDashboard.member })),
    );
    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We could not load your account information.",
    );
    expect(
      screen.queryByText(/invalid_dashboard_contract/),
    ).not.toBeInTheDocument();
  });

  it("retries through the interface and renders the next successful response", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockRejectedValueOnce(new Error("network detail"))
        .mockResolvedValueOnce(response(freshAccountDashboard)),
    );
    render(<App />);

    await user.click(await screen.findByRole("button", { name: /try again/i }));
    expect(
      await screen.findByRole("heading", { name: /Alex Morgan/ }),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("forwards only an allowed URL scenario", async () => {
    window.history.replaceState({}, "", "/?scenario=stale");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(response(staleAccountDashboard)),
    );
    render(<App />);
    await screen.findByRole("heading", { name: /Alex Morgan/ });
    expect(fetch).toHaveBeenCalledWith("/api/dashboard?scenario=stale");
  });
});
