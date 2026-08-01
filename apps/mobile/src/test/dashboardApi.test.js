import { dashboardScenario, fetchDashboard } from "../api/dashboard";

const validDashboard = {
  member: { displayName: "Alex Morgan" },
  projection: { generatedAt: "2026-07-31T12:00:00Z", isStale: false },
  accounts: [],
};

describe("mobile dashboard API client", () => {
  afterEach(() => jest.restoreAllMocks());

  it("allowlists deterministic scenarios and uses the configured API base URL", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue({ ok: true, json: async () => validDashboard });
    await fetchDashboard({ baseUrl: "http://api.test/", scenario: "stale" });
    expect(fetch).toHaveBeenCalledWith(
      "http://api.test/api/dashboard?scenario=stale",
      { signal: undefined },
    );
    expect(dashboardScenario("not-allowed")).toBe("success");
  });

  it("rejects malformed HTTP 200 data before it reaches the screen", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue({ ok: true, json: async () => ({ member: {} }) });
    await expect(fetchDashboard()).rejects.toThrow(
      "invalid_dashboard_contract",
    );
  });
});
