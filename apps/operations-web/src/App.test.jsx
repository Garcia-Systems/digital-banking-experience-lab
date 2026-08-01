import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const createJsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input, options = {}) => {
      const url = typeof input === "string" ? input : input.url;
      const method = options.method ?? "GET";
      if (method !== "GET") {
        throw new Error(`Unexpected request: ${method} ${url}`);
      }
      const body = responses[url];
      if (options.headers?.["X-Laboratory-Role"] !== "operations-user") {
        return createJsonResponse({}, 403);
      }
      if (body) return createJsonResponse(body);
      if (
        /^\/api\/operations\/(members|transfers|failures|verifications)\/[^/]+$/.test(
          url,
        )
      ) {
        return createJsonResponse({}, 404);
      }
      throw new Error(`Unexpected request: ${method} ${url}`);
    }),
  );
});

describe("operations portal", () => {
  it("renders the shared layout, dashboard summary, and distinct link regions", async () => {
    renderOperationsApp("/operations");

    const navigation = screen.getByRole("navigation", { name: /operations/i });
    expect(within(navigation).getAllByRole("link")).toHaveLength(5);
    expect(
      within(navigation).getByRole("link", { name: /^transfers$/i }),
    ).toHaveAttribute("href", "/operations/transfers");
    expect(
      screen.getByText(/signed in as operations user/i),
    ).toBeInTheDocument();

    const metrics = screen.getByRole("region", { name: /operations metrics/i });
    expect(within(metrics).getByText("System Health")).toBeInTheDocument();
    expect(within(metrics).getByText("Operational")).toBeInTheDocument();

    const quickLinksSection = screen
      .getByRole("heading", { name: /continue an employee workflow/i })
      .closest("section");
    const expectedQuickLinks = [
      ["Members", "/operations/members"],
      ["Transfers", "/operations/transfers"],
      ["Failed Operations", "/operations/failures"],
      ["Verification Requests", "/operations/verifications"],
    ];
    for (const [name, href] of expectedQuickLinks) {
      expect(
        within(quickLinksSection).getByRole("link", { name }),
      ).toHaveAttribute("href", href);
    }

    const awarenessSection = screen
      .getByRole("heading", { name: /operational awareness/i })
      .closest("section");
    expect(
      within(awarenessSection).getByText(
        /all educational services are responding normally/i,
      ),
    ).toBeInTheDocument();
    expect(
      within(awarenessSection).getByText(`Snapshot: ${dashboard.generatedAt}`),
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith("/api/operations/dashboard", {
        headers: { "X-Laboratory-Role": "operations-user" },
      }),
    );
  });

  it("marks Dashboard as active on the dashboard route", async () => {
    renderOperationsApp("/operations");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const navigation = screen.getByRole("navigation", { name: /operations/i });
    expect(
      within(navigation).getByRole("link", { name: /home/i }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(navigation).getByRole("link", { name: /members/i }),
    ).not.toHaveAttribute("aria-current");
  });

  it("keeps the deterministic dashboard visible when its API is unavailable", async () => {
    fetch.mockResolvedValueOnce(createJsonResponse({}, 503));
    renderOperationsApp("/operations");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /live API unavailable; showing the deterministic educational snapshot/i,
    );
    expect(
      within(
        screen.getByRole("region", { name: /operations metrics/i }),
      ).getByText("Operational"),
    ).toBeInTheDocument();
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
    const user = userEvent.setup();
    renderOperationsApp("/operations/members/member-1003");
    expect(
      await screen.findByRole("heading", { name: "Sam Rivera" }),
    ).toBeInTheDocument();

    const accountsSection = screen
      .getByRole("heading", { name: /fictional accounts/i })
      .closest("section");
    expect(within(accountsSection).getByText(/\$518\.90/)).toBeInTheDocument();

    const transfersSection = screen
      .getByRole("heading", { name: /recent transfers/i })
      .closest("section");
    const transferLink = within(transfersSection).getByRole("link", {
      name: "transfer-7003",
    });
    expect(transferLink).toHaveAttribute(
      "href",
      "/operations/transfers/transfer-7003",
    );

    const failuresSection = screen
      .getByRole("heading", { name: /recent failed operations/i })
      .closest("section");
    const failureLink = within(failuresSection).getByRole("link", {
      name: "failure-9002",
    });
    expect(failureLink).toHaveAttribute(
      "href",
      "/operations/failures/failure-9002",
    );

    await user.click(transferLink);
    expect(
      await screen.findByRole("heading", { name: "transfer-7003" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sam Rivera")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view member/i })).toHaveAttribute(
      "href",
      "/operations/members/member-1003",
    );

    await user.click(screen.getByRole("link", { name: "failure-9002" }));
    expect(
      await screen.findByRole("heading", { name: "failure-9002" }),
    ).toBeInTheDocument();
  });

  it("opens a failed operation from the member context", async () => {
    const user = userEvent.setup();
    renderOperationsApp("/operations/members/member-1003");
    const failuresSection = (
      await screen.findByRole("heading", {
        name: /recent failed operations/i,
      })
    ).closest("section");
    await user.click(
      within(failuresSection).getByRole("link", { name: "failure-9002" }),
    );
    expect(
      await screen.findByRole("heading", { name: "failure-9002" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Manual Review Required")).toBeInTheDocument();
  });

  it("returns from member detail to the member lookup", async () => {
    const user = userEvent.setup();
    renderOperationsApp("/operations/members/member-1003");
    await user.click(
      await screen.findByRole("link", { name: /return to members/i }),
    );
    expect(
      await screen.findByRole("heading", { name: /member lookup/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "member-1003" })).toHaveAttribute(
      "href",
      "/operations/members/member-1003",
    );
  });

  it("renders verification list and detail workflows", async () => {
    const view = renderOperationsApp("/operations/verifications");
    expect(
      await screen.findByRole("link", { name: "verification-5001" }),
    ).toBeInTheDocument();
    view.unmount();
    renderOperationsApp("/operations/verifications/verification-5001");
    expect(
      await screen.findByText(
        "Identity evidence is awaiting a deterministic vendor retry.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "failure-9001" }),
    ).toBeInTheDocument();
  });

  it.each([
    ["member", "/operations/members/unknown", "Member not found"],
    ["transfer", "/operations/transfers/unknown", "Transfer not found"],
    [
      "failed operation",
      "/operations/failures/unknown",
      "Failed operation not found",
    ],
    [
      "verification request",
      "/operations/verifications/unknown",
      "Verification request not found",
    ],
  ])("shows a safe message for an unknown %s", async (_, route, heading) => {
    renderOperationsApp(route);
    expect(
      await screen.findByRole("heading", { name: heading }),
    ).toBeInTheDocument();
  });
});
