import { Spinner } from "@heroui/react";
import type { LoadingStateProps } from "@/components/ui/ui.interfaces";

export function LoadingState({
  message = "Loading…",
  className,
  fullScreen = false,
}: LoadingStateProps) {
  const containerClass = fullScreen
    ? "flex min-h-[50vh] flex-col items-center justify-center gap-3"
    : "flex flex-col items-center justify-center gap-3 py-12";

  return (
    <div
      className={`${containerClass} ${className ?? ""}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner color="accent" size="lg" />
      <p className="text-sm text-campus-ink/70">{message}</p>
    </div>
  );
}
