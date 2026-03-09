import { NavLink } from "react-router-dom";

import { StatusPill } from "@/common/components";
import { cn } from "@/lib/utils";

export function StepLink({
  to,
  title,
  done,
}: {
  to: string;
  title: string;
  done: boolean;
}) {
  return (
    <NavLink
      end
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-2xl border px-4 py-3 text-sm transition",
          isActive
            ? "border-foreground bg-foreground text-background"
            : "border-border/80 bg-white/75 text-foreground/80 hover:border-foreground/30 hover:bg-white"
        )
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{title}</span>
        <StatusPill label={done ? "done" : "pending"} tone={done ? "success" : "default"} />
      </div>
    </NavLink>
  );
}
