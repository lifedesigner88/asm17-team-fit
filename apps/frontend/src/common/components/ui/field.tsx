import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-foreground/80">
      <span className="mb-1.5 block">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs font-normal text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
