/**
 * MVP search strategy for Firestore:
 * - Normalize title/description into lowercase tokens and prefix keywords.
 * - Query with `array-contains` against `searchKeywords`.
 * - This is prefix/token matching, not arbitrary full-text search.
 */
export function buildSearchKeywords(...parts: readonly string[]): string[] {
  const keywords = new Set<string>();

  for (const part of parts) {
    const normalized = part
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .trim();

    if (!normalized) {
      continue;
    }

    const tokens = normalized.split(/\s+/).filter(Boolean);
    for (const token of tokens) {
      keywords.add(token);
      const maxPrefix = Math.min(token.length, 12);
      for (let i = 1; i <= maxPrefix; i += 1) {
        keywords.add(token.slice(0, i));
      }
    }
  }

  return Array.from(keywords).slice(0, 40);
}

export function normalizeSearchTerm(term: string): string {
  return term.trim().toLowerCase().replace(/\s+/g, " ");
}
