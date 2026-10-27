type AuthActionStatusMarkProps = {
  readonly variant: "success" | "error" | "loading";
};

export function AuthActionStatusMark({ variant }: AuthActionStatusMarkProps) {
  const tone =
    variant === "success"
      ? "bg-campus-leaf/12 text-campus-leaf"
      : variant === "error"
        ? "bg-campus-copper/12 text-campus-copper"
        : "bg-campus-mist text-campus-ink/55";

  return (
    <div
      aria-hidden
      className={`mb-6 inline-flex size-16 items-center justify-center rounded-2xl ${tone} auth-action-mark`}
    >
      {variant === "loading" ? (
        <span className="size-6 animate-pulse rounded-full bg-current/35" />
      ) : null}
      {variant === "success" ? (
        <svg className="auth-action-check" fill="none" height="28" viewBox="0 0 28 28" width="28">
          <path
            d="M6 14.5 11.5 20 22 8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
        </svg>
      ) : null}
      {variant === "error" ? (
        <svg fill="none" height="28" viewBox="0 0 28 28" width="28">
          <path
            d="M9 9l10 10M19 9 9 19"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.4"
          />
        </svg>
      ) : null}
    </div>
  );
}
