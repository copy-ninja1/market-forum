import { describe, expect, it } from "vitest";
import { buildSearchKeywords, normalizeSearchTerm } from "@/utils/search.utils";

describe("normalizeSearchTerm", () => {
  it("trims and lowercases input", () => {
    expect(normalizeSearchTerm("  Calculus Textbook  ")).toBe("calculus textbook");
  });
});

describe("buildSearchKeywords", () => {
  it("creates tokens and prefixes for title parts", () => {
    const keywords = buildSearchKeywords("Bike Lock");
    expect(keywords).toContain("bike");
    expect(keywords).toContain("lock");
    expect(keywords).toContain("b");
    expect(keywords).toContain("bi");
  });

  it("limits keyword count", () => {
    const long = Array.from({ length: 30 }, (_, index) => `word${index}`).join(" ");
    const keywords = buildSearchKeywords(long);
    expect(keywords.length).toBeLessThanOrEqual(40);
  });
});
