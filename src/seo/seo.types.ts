export type RobotsDirective =
  | "index,follow"
  | "noindex,nofollow"
  | "noindex,follow"
  | "index,nofollow";

export type PageSeoInput = {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly robots?: RobotsDirective;
  readonly imageUrl?: string;
  readonly imageAlt?: string;
  readonly type?: "website" | "article" | "product";
  readonly jsonLd?: readonly Record<string, unknown>[];
  readonly ssrHtml?: string;
};

export type ResolvedPageSeo = {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly robots: RobotsDirective;
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly type: "website" | "article" | "product";
  readonly jsonLd: readonly Record<string, unknown>[];
  readonly ssrHtml: string;
};

export type PublicMemberSeoSource = {
  readonly uid: string;
  readonly displayName: string;
  readonly institution: string;
};

export type PublicListingSeoSource = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly currencyCode: string;
  readonly status: "active" | "sold" | "unavailable" | "hidden";
  readonly categoryName: string;
  readonly locationLabel: string;
  readonly condition: string;
  readonly ownerUid: string;
  readonly ownerDisplayName: string;
  readonly imageUrl: string | null;
  readonly imageAlt: string | null;
  readonly updatedAtIso: string;
};
