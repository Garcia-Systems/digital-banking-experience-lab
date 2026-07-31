import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { freshAccountDashboard } from "./data/accountDashboardFixtures";
import App from "./App";

describe("dashboard API loading", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows a loading state while the request is pending", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
    render(<App />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading dashboard...",
    );
  });

  it("renders the dashboard returned by the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(freshAccountDashboard),
      }),
    );
    render(<App />);

    expect(
      await screen.findByRole("heading", { name: /Alex Morgan/ }),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/dashboard");
    expect(
      screen.getByRole("heading", { name: "Everyday Checking" }),
    ).toBeInTheDocument();
  });

  it("shows a safe error when the API request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("PHP details")));
    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load dashboard.",
    );
    expect(screen.queryByText("PHP details")).not.toBeInTheDocument();
  });
});
