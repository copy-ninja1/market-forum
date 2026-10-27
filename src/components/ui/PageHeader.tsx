import type { PageHeaderProps } from "@/components/ui/ui.interfaces";

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header
      className={`mb-6 flex flex-col gap-4 border-b border-campus-mist pb-6 md:mb-8 md:flex-row md:items-end md:justify-between ${className ?? ""}`.trim()}
    >
      <div className="space-y-1">
        <h1 className="font-display text-3xl tracking-tight text-campus-ink md:text-4xl">{title}</h1>
        {description ? <p className="max-w-2xl text-base text-campus-ink/75">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
