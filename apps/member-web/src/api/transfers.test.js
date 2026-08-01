import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildTransferEndpoint,
  selectTransferScenario,
  submitTransfer,
} from "./transfers";

describe("transfer API client", () => {
  afterEach(() => vi.restoreAllMocks());

  it("selects only allowlisted laboratory scenarios", () => {
    expect(selectTransferScenario("")).toBeUndefined();
    expect(
      selectTransferScenario("?transferScenario=unavailable&debug=secret"),
    ).toBe("unavailable");
    expect(
      selectTransferScenario("?transferScenario=not-supported"),
    ).toBeUndefined();
  });

  it("omits absent and unsupported scenarios from the endpoint", () => {
    expect(buildTransferEndpoint()).toBe("/api/transfers");
    expect(buildTransferEndpoint("not-supported")).toBe("/api/transfers");
    expect(buildTransferEndpoint("unavailable")).toBe(
      "/api/transfers?scenario=unavailable",
    );
  });

  it("posts the unchanged payload to the selected endpoint", async () => {
    const payload = {
      sourceAccount: "account-2001",
      destinationAccount: "account-2002",
      amountCents: 2550,
      memo: "Vacation fund",
      idempotencyKey: "member-intent-1",
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true });

    await submitTransfer(payload, { scenario: "unavailable" });

    expect(fetch).toHaveBeenCalledWith(
      "/api/transfers?scenario=unavailable",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(payload);
  });
});
