export type AppErrorCode =
  | "unauthenticated"
  | "forbidden"
  | "not-found"
  | "validation"
  | "conflict"
  | "network"
  | "storage"
  | "unknown";

export type AppError = {
  readonly code: AppErrorCode;
  readonly message: string;
  readonly cause?: unknown;
};

export type AsyncState<T> =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "success"; readonly data: T }
  | { readonly status: "error"; readonly error: AppError };
