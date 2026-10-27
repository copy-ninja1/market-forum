type BrandMarkProps = {
  readonly className?: string;
};

/** Single-element price-tag mark used across the app chrome. */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-campus-ink text-campus-paper ${className ?? ""}`.trim()}
    >
      <svg fill="none" height="20" viewBox="0 0 64 64" width="20">
        <path
          d="M38.2 8.4c1.1-1.1 2.9-1.1 4 0l13.4 13.4c1.1 1.1 1.1 2.9 0 4L28.4 52.9c-.5.5-1.2.8-1.9.8H10.8c-1.5 0-2.7-1.2-2.7-2.7V34.3c0-.7.3-1.4.8-1.9L38.2 8.4Zm5.1 10.2a3.6 3.6 0 1 0 5.1 5.1 3.6 3.6 0 0 0-5.1-5.1Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </span>
  );
}
