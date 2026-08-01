import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "../test/renderWithRouter";
import MemberVerification from "./MemberVerification";

const initial = {
  status: "not_started",
  lastAttemptAt: null,
  message: "Verify your identity.",
  canRetry: false,
};
const response = (body, ok = true) => ({
  ok,
  json: () => Promise.resolve(body),
});

describe("member verification", () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ["success", "verified", "Verified", "Your identity has been verified."],
    ["timeout", "retry_required", "Retry Required", "Please try again."],
    [
      "permanent-failure",
      "verification_failed",
      "Verification Failed",
      "Your verification was permanently rejected. Please contact Harbor Community Credit Union if you need assistance.",
    ],
  ])("handles the %s outcome", async (scenario, status, label, message) => {
    const user = userEvent.setup();
    let finish;
    const result = {
      status,
      lastAttemptAt: "2026-07-31T12:00:00Z",
      message,
      canRetry: status === "retry_required",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn((url, options) => {
        if (!options) return Promise.resolve(response(initial));
        return new Promise((resolve) => {
          finish = () => resolve(response(result, status === "verified"));
        });
      }),
    );
    renderWithRouter(<MemberVerification />, {
      route: `/verification?verificationScenario=${scenario}`,
    });
    expect(
      screen.getByText("Loading verification status…"),
    ).toBeInTheDocument();
    await user.click(
      await screen.findByRole("button", { name: "Start verification" }),
    );
    expect(screen.getByText("Verification Pending")).toBeInTheDocument();
    finish();
    expect(await screen.findByText(label)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
    if (status === "retry_required")
      expect(
        screen.getByRole("button", { name: "Try Again" }),
      ).toBeInTheDocument();
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        `/api/member-verification?scenario=${scenario}`,
        { method: "POST" },
      ),
    );
  });

  it("uses safe messaging when the API cannot be reached", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("vendor secret"))),
    );
    renderWithRouter(<MemberVerification />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We could not load your verification status",
    );
    expect(screen.queryByText("vendor secret")).not.toBeInTheDocument();
  });

  it("disables retry while active, prevents duplicates, and shows success", async () => {
    const user = userEvent.setup();
    let finishRetry;
    const retryRequired = {
      status: "retry_required",
      lastAttemptAt: "2026-07-31T12:00:00Z",
      message: "We couldn't complete your request right now.",
      canRetry: true,
    };
    const verified = {
      ...retryRequired,
      status: "verified",
      message: "Your identity has been verified. No further action is needed.",
      canRetry: false,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(retryRequired))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finishRetry = () => resolve(response(verified));
          }),
      );
    vi.stubGlobal("fetch", fetchMock);

    renderWithRouter(<MemberVerification />, {
      route: "/verification?verificationScenario=timeout-then-success",
    });
    const retry = await screen.findByRole("button", { name: "Try Again" });
    await user.click(retry);
    await user.click(retry);

    expect(
      screen.getByRole("button", { name: "Trying Again…" }),
    ).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Retrying your verification",
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
    finishRetry();
    expect(await screen.findByText("Verified")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Try Again" }),
    ).not.toBeInTheDocument();
  });
});
