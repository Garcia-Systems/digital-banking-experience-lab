import { describe, expect, it } from "vitest";
import {
  emptyAccountDashboard,
  freshAccountDashboard,
  individualCheckingDashboard,
  jointSavingsDashboard,
  staleAccountDashboard,
} from "./accountDashboardFixtures";
import { selectDashboardFixture } from "./selectDashboardFixture";

describe("dashboard fixture selection", () => {
  it("selects deterministic chapter scenarios", () => {
    expect(selectDashboardFixture("?scenario=multiple-accounts")).toBe(
      freshAccountDashboard,
      individualCheckingDashboard,
      jointSavingsDashboard,
    );
    expect(selectDashboardFixture("?scenario=individual-checking")).toBe(
      individualCheckingDashboard,
    );
    expect(selectDashboardFixture("?scenario=joint-savings")).toBe(
      jointSavingsDashboard,
    );
    expect(selectDashboardFixture("?scenario=empty-accounts")).toBe(
      emptyAccountDashboard,
    );
    expect(selectDashboardFixture("?scenario=stale")).toBe(
      staleAccountDashboard,
    );
  });
});
