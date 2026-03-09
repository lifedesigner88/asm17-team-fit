import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Input(props: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-border/80 bg-white/80 px-3.5 py-3 text-sm outline-none transition",
        "placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:bg-white focus:ring-4 focus:ring-foreground/5",
        props.className
      )}
    />
  );
}
