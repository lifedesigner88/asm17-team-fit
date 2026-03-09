import { NavLink } from "react-router-dom";

import { Button, ShellCard, StatusPill } from "@/common/components";

import { useCaptureRouteData } from "../utils/hooks";

export function CaptureOverviewPage() {
  const { draft, nextPath, completion } = useCaptureRouteData();

  return (
    <ShellCard className="bg-white/92">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-3">
          <StatusPill label="Workflow entry" />
          <h3 className="text-2xl font-semibold tracking-[-0.03em]">Prepare the draft payload before wiring the API</h3>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            The next backend phase will turn this local draft into a real job request. For now, the goal is to finalize
            screen hierarchy, field semantics, and step transitions.
          </p>
        </div>
        <NavLink to={nextPath}>
          <Button size="lg">{completion.interview || completion.voice || completion.image ? "Continue draft" : "Start capture"}</Button>
        </NavLink>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ShellCard className="bg-secondary/35 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Interview</div>
          <p className="mt-3 text-sm leading-6 text-foreground/80">
            {draft.interview.selfSummary || "Describe how the user sees themselves, their values, and their speaking texture."}
          </p>
        </ShellCard>
        <ShellCard className="bg-secondary/35 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Voice</div>
          <p className="mt-3 text-sm leading-6 text-foreground/80">
            {draft.voice.toneNotes || "Capture either a sample filename or notes about delivery, energy, and pacing."}
          </p>
        </ShellCard>
        <ShellCard className="bg-secondary/35 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Image</div>
          <p className="mt-3 text-sm leading-6 text-foreground/80">
            {draft.image.visualDirection || "Collect a reference image path, camera intent, and the artistic direction you want."}
          </p>
        </ShellCard>
      </div>
    </ShellCard>
  );
}
