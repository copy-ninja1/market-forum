import { Spinner } from "@heroui/react";
import type { LoadingStateProps } from "@/components/ui/ui.interfaces";

export function LoadingState({
  message = "Loading…",
  className,
  fullScreen = false,
}: LoadingStateProps) {
  const containerClass = fullScreen
    ? "flex min-h-screen flex-col items-center justify-center gap-3"
    : "panel flex flex-col items-center justify-center gap-3 py-16";

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
