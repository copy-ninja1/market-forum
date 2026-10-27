export type CursorPage<T> = {
  readonly items: readonly T[];
  readonly nextCursor: string | null;
  readonly hasMore: boolean;
};

export type PageRequest = {
  readonly pageSize: number;
  readonly cursor?: string | null;
};
