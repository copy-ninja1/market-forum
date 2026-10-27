import type { EmptyStateProps } from "@/components/ui/ui.interfaces";

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <section
      className={`panel flex flex-col items-center px-6 py-14 text-center ${className ?? ""}`.trim()}
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-campus-leaf">Nothing here</p>
      <h2 className="font-display mt-3 text-3xl tracking-tight text-campus-ink">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-campus-ink/70">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
