import { Button, Card } from "@heroui/react";
import type { ErrorStateProps } from "@/components/ui/ui.interfaces";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <Card
      className={`border border-danger/25 bg-campus-paper/95 ${className ?? ""}`.trim()}
      variant="secondary"
    >
      <Card.Header className="flex flex-col gap-2 text-center md:text-left">
        <Card.Title className="font-display text-xl text-campus-ink">{title}</Card.Title>
        <Card.Description className="text-campus-ink/80">{message}</Card.Description>
      </Card.Header>
      {onRetry ? (
        <Card.Footer className="justify-center md:justify-start">
          <Button variant="primary" onPress={onRetry}>
            {retryLabel}
          </Button>
        </Card.Footer>
      ) : null}
    </Card>
  );
}
