import { describe, expect, it } from "vitest";
import { formatCents, formatMaskedSuffix, formatOwnership } from "./formatters";
describe("migrated TypeScript formatters", () => {
  it("preserves the JavaScript utility results", () => {
    expect(formatCents(123456)).toBe("$1,234.56");
    expect(formatMaskedSuffix("0042")).toBe("•••• 0042");
    expect(formatOwnership("joint")).toBe("Joint");
    expect(formatOwnership("individual")).toBe("Individual");
  });
});
