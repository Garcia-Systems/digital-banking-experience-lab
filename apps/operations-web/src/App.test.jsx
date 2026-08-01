import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { dashboard, members, transfers } from "./data/operationsFixtures.js";
import { renderOperationsApp } from "./test/renderOperationsApp.jsx";

const responses = {
  "/api/operations/dashboard": dashboard,
  "/api/operations/members": { members },
  "/api/operations/transfers": { transfers },
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url, options = {}) => {
      const body = responses[url];
      if (
        !body ||
        options.headers?.["X-Laboratory-Role"] !== "operations-user"
      ) {
        return { ok: false, status: 403, json: async () => ({}) };
      }
      return { ok: true, status: 200, json: async () => body };
    }),
  );
});

describe("operations portal", () => {
  it("renders the dashboard and operations navigation", async () => {
    renderOperationsApp("/");

    expect(screen.getByText("System Health")).toBeInTheDocument();
    const navigation = screen.getByRole("navigation", { name: /operations/i });
    expect(within(navigation).getAllByRole("link")).toHaveLength(3);
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith("/api/operations/dashboard", {
        headers: { "X-Laboratory-Role": "operations-user" },
      }),
    );
  });

  it("marks Dashboard as active on the dashboard route", async () => {
    renderOperationsApp("/");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /members/i })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marks Members as active on the member lookup route", async () => {
    renderOperationsApp("/members");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByRole("link", { name: /members/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).not.toHaveAttribute("aria-current");
  });

  it("marks Transfers as active on the transfer review route", async () => {
    renderOperationsApp("/transfers");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByRole("link", { name: /^transfers$/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /members/i })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("filters member fixtures by name and member ID", async () => {
    renderOperationsApp("/members");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Jordan" },
    });
    expect(screen.getByText("member-1002")).toBeInTheDocument();
    expect(screen.queryByText("member-1001")).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "member-1003" },
    });
    expect(screen.getByText("Sam Rivera")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/operations/members", {
      headers: { "X-Laboratory-Role": "operations-user" },
    });
  });

  it("displays deterministic transfers and their detail links", async () => {
    renderOperationsApp("/transfers");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByRole("link", { name: "transfer-7001" })).toHaveAttribute(
      "href",
      "/transfers/transfer-7001",
    );
    expect(screen.getByText("$125.00")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/operations/transfers", {
      headers: { "X-Laboratory-Role": "operations-user" },
    });
  });

  it("handles unauthorized access without mounting operations navigation", () => {
    renderOperationsApp("/", { role: "member-user" });

    expect(
      screen.getByRole("heading", { name: "Operations access required" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
