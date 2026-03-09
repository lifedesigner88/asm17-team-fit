import { Form, Outlet, useLoaderData } from "react-router-dom";

import { Button, ShellCard, StatusPill } from "@/common/components";

import { StepLink } from "../components";
import type { CaptureLoaderData } from "../utils/types";

export function CaptureLayout() {
  const { completion, progressCount } = useLoaderData() as CaptureLoaderData;

  return (
    <div className="space-y-6">
      <ShellCard className="overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,244,238,0.96))]">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            <StatusPill label="Capture flow" />
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
              Build the first multimodal draft before the AI pipeline exists.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              This front-end flow captures interview, voice, and image intent first. The current version stores a local
              draft in the browser session so the UX can be validated before backend job APIs are added.
            </p>
          </div>
          <div className="rounded-[22px] border border-black/5 bg-white/80 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Progress</span>
              <StatusPill label={`${progressCount}/3 steps`} tone={progressCount === 3 ? "success" : "default"} />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary/80">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(progressCount / 3) * 100}%` }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Files are not uploaded yet. For now, file inputs keep only metadata like the chosen filename so the next
              backend API can attach real upload handling without redesigning the screens.
            </p>
          </div>
        </div>
      </ShellCard>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ShellCard className="h-fit bg-white/88">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-[-0.03em]">Step map</h3>
            <p className="text-sm text-muted-foreground">Move step by step or jump back to revise any section.</p>
          </div>
          <div className="mt-5 grid gap-3">
            <StepLink done={completion.interview} title="1. Interview" to="/capture/interview" />
            <StepLink done={completion.voice} title="2. Voice" to="/capture/voice" />
            <StepLink done={completion.image} title="3. Image" to="/capture/image" />
            <StepLink done={completion.interview && completion.voice && completion.image} title="4. Review" to="/capture/review" />
          </div>
          <Form action="/capture/reset" className="mt-5" method="post">
            <Button className="w-full" type="submit" variant="outline">
              Reset local draft
            </Button>
          </Form>
        </ShellCard>

        <div className="space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
