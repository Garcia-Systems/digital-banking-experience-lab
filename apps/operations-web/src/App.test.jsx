import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  dashboard,
  failures,
  members,
  transfers,
  verifications,
} from "./data/operationsFixtures.js";
import { renderOperationsApp } from "./test/renderOperationsApp.jsx";

const responses = {
  "/api/operations/dashboard": dashboard,
  "/api/operations/members": { members },
  "/api/operations/transfers": { transfers },
  "/api/operations/failures": { failures },
  "/api/operations/verifications": { verifications },
  ...Object.fromEntries(
    members.map((member) => [
      `/api/operations/members/${member.memberId}`,
      {
        member,
        transfers: transfers.filter(
          (record) => record.memberId === member.memberId,
        ),
        failures: failures.filter((record) =>
          record.member.includes(member.memberId),
        ),
      },
    ]),
  ),
  ...Object.fromEntries(
    transfers.map((transfer) => [
      `/api/operations/transfers/${transfer.transferId}`,
      { transfer },
    ]),
  ),
  ...Object.fromEntries(
    verifications.map((verification) => [
      `/api/operations/verifications/${verification.verificationId}`,
      { verification },
    ]),
  ),
  ...Object.fromEntries(
    failures.map((failure) => [
      `/api/operations/failures/${failure.operationId}`,
      { failure },
    ]),
  ),
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
    expect(within(navigation).getAllByRole("link")).toHaveLength(5);
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith("/api/operations/dashboard", {
        headers: { "X-Laboratory-Role": "operations-user" },
      }),
    );
  });

  it("marks Dashboard as active on the dashboard route", async () => {
    renderOperationsApp("/");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /members/i })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marks Members as active on the member lookup route", async () => {
    renderOperationsApp("/operations/members");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByRole("link", { name: /members/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /home/i })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marks Transfers as active on the transfer review route", async () => {
    renderOperationsApp("/operations/transfers");
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
    renderOperationsApp("/operations/members");
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
    renderOperationsApp("/operations/transfers");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByRole("link", { name: "transfer-7001" })).toHaveAttribute(
      "href",
      "/operations/transfers/transfer-7001",
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

  it("renders a deterministic failed operations list and navigation", async () => {
    renderOperationsApp("/operations/failures");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(
      screen.getByRole("heading", { name: "Failed Operations" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "failure-9001" })).toHaveAttribute(
      "href",
      "/operations/failures/failure-9001",
    );
    expect(screen.getByText("Vendor Timeout")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Failed Operations" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("shows retry eligibility and the audit timeline in failure details", async () => {
    renderOperationsApp("/operations/failures/failure-9001");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByText("Retry Eligible")).toBeInTheDocument();
    expect(screen.getByText("Vendor timeout recorded")).toBeInTheDocument();
    expect(screen.getByText(/No member action is needed/)).toBeInTheDocument();
  });

  it("shows manual review for a permanent failure", async () => {
    renderOperationsApp("/operations/failures/failure-9002");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByText("Manual Review Required")).toBeInTheDocument();
    expect(
      screen.getByText(/Permanent Validation Failure/),
    ).toBeInTheDocument();
  });

  it("connects member, transfer, and failure details", async () => {
    renderOperationsApp("/operations/members/member-1003");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(screen.getByText("$518.90")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "transfer-7003" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "failure-9002" }),
    ).toBeInTheDocument();
  });

  it("renders verification list and detail workflows", async () => {
    const view = renderOperationsApp("/operations/verifications");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(
      screen.getByRole("link", { name: "verification-5001" }),
    ).toBeInTheDocument();
    view.unmount();
    renderOperationsApp("/operations/verifications/verification-5001");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(
      screen.getByText(
        "Identity evidence is awaiting a deterministic vendor retry.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "failure-9001" }),
    ).toBeInTheDocument();
  });
});
