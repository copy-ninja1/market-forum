type BrandMarkProps = {
  readonly className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-campus-ink text-campus-paper ${className ?? ""}`.trim()}
    >
      <svg fill="none" height="22" viewBox="0 0 24 24" width="22">
        <path
          d="M12 3.2c-2.4 3.1-5.6 4.6-5.6 8.2 0 3.2 2.5 5.6 5.6 5.6s5.6-2.4 5.6-5.6c0-3.6-3.2-5.1-5.6-8.2Z"
          fill="currentColor"
        />
        <path d="M5 19.2h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
        <path d="M7.5 16.6h9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      </svg>
    </span>
  );
}
