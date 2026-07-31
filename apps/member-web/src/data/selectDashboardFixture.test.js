import { describe, expect, it } from "vitest";
import {
  emptyAccountDashboard,
  freshAccountDashboard,
  staleAccountDashboard,
} from "./accountDashboardFixtures";
import { selectDashboardFixture } from "./selectDashboardFixture";

describe("dashboard fixture selection", () => {
  it("selects deterministic chapter scenarios", () => {
    expect(selectDashboardFixture("?scenario=multiple-accounts")).toBe(
      freshAccountDashboard,
    );
    expect(selectDashboardFixture("?scenario=empty-accounts")).toBe(
      emptyAccountDashboard,
    );
    expect(selectDashboardFixture("?scenario=stale")).toBe(
      staleAccountDashboard,
    );
  });
});
