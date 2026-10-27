import type { PageHeaderProps } from "@/components/ui/ui.interfaces";

export function PageHeader({ title, eyebrow, description, actions, className }: PageHeaderProps) {
  return (
    <header
      className={`mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${className ?? ""}`.trim()}
    >
      <div className="max-w-2xl space-y-2">
        {eyebrow ? (
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-campus-leaf">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl tracking-tight text-campus-ink md:text-5xl">{title}</h1>
        {description ? (
          <p className="max-w-xl text-base leading-relaxed text-campus-ink/70">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
