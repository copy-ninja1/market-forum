import { describe, expect, it } from "vitest";
import { formatMoney } from "@/utils/currency.utils";

describe("formatMoney", () => {
  it("formats USD amounts", () => {
    expect(formatMoney(12.5, "USD", "en-US")).toContain("12.50");
  });

  it("falls back for invalid currency codes", () => {
    expect(formatMoney(10, "INVALID", "en-US")).toBe("INVALID 10.00");
  });
});
