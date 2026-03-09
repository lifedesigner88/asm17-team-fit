export function ChoiceCard({
  defaultChecked,
  title,
  description,
  value,
  name,
}: {
  defaultChecked: boolean;
  title: string;
  description: string;
  value: string;
  name: string;
}) {
  return (
    <label className="block">
      <input className="peer sr-only" defaultChecked={defaultChecked} name={name} type="radio" value={value} />
      <div className="rounded-2xl border border-border/80 bg-white/70 p-4 transition hover:bg-white peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background">
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground peer-checked:text-background/80">{description}</div>
      </div>
    </label>
  );
}
