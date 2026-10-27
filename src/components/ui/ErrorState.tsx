import { Button } from "@heroui/react";
import type { ErrorStateProps } from "@/components/ui/ui.interfaces";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <section className={`panel px-6 py-8 ${className ?? ""}`.trim()} role="alert">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-danger">Needs attention</p>
      <h2 className="font-display mt-2 text-3xl tracking-tight text-campus-ink">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-campus-ink/75">{message}</p>
      {onRetry ? (
        <Button className="mt-6" variant="primary" onPress={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </section>
  );
}
