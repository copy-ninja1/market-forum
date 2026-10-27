import { Card } from "@heroui/react";
import type { EmptyStateProps } from "@/components/ui/ui.interfaces";

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <Card
      className={`border border-campus-mist/80 bg-campus-paper/90 ${className ?? ""}`.trim()}
      variant="secondary"
    >
      <Card.Header className="flex flex-col items-center gap-2 text-center">
        <Card.Title className="font-display text-xl text-campus-ink">{title}</Card.Title>
        {description ? (
          <Card.Description className="max-w-md text-campus-ink/75">{description}</Card.Description>
        ) : null}
      </Card.Header>
      {action ? <Card.Footer className="justify-center pb-6">{action}</Card.Footer> : null}
    </Card>
  );
}
