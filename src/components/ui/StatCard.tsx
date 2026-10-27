type StatCardProps = {
  readonly label: string;
  readonly value: string | number;
  readonly hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="panel px-5 py-4">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-campus-ink/55">
        {label}
      </p>
      <p className="font-display mt-2 text-3xl tracking-tight text-campus-ink">{value}</p>
      {hint ? <p className="mt-1 text-sm text-campus-ink/65">{hint}</p> : null}
    </article>
  );
}
