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
const response = (body) => ({ ok: true, json: () => Promise.resolve(body) });

describe("member verification", () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ["success", "verified", "Verified", "Your identity has been verified."],
    ["timeout", "retry_required", "Retry Required", "Please try again."],
    [
      "permanent-failure",
      "verification_failed",
      "Verification Failed",
      "We couldn't verify your information. Please contact Harbor Community Credit Union.",
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
          finish = () => resolve(response(result));
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
});
