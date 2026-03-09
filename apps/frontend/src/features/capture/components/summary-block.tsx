import type { ReactNode } from "react";

import { ShellCard } from "@/common/components";

export function SummaryBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <ShellCard className="bg-secondary/35 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</div>
      <div className="mt-3 space-y-3 text-sm leading-6 text-foreground/85">{children}</div>
    </ShellCard>
  );
}
