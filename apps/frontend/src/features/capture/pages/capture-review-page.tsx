import { NavLink } from "react-router-dom";

import { Button, ShellCard, StatusPill } from "@/common/components";

import { SummaryBlock } from "../components";
import { useCaptureRouteData } from "../utils/hooks";

export function CaptureReviewPage() {
  const { draft, completion } = useCaptureRouteData();
  const ready = completion.interview && completion.voice && completion.image;

  return (
    <div className="space-y-6">
      <ShellCard className="bg-white/92">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            <StatusPill label="Step 4" tone={ready ? "success" : "warn"} />
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">Review draft package</h3>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              This is the shape of the future backend payload. When upload and job APIs are added, this review step can
              become the actual submission gate.
            </p>
          </div>
          <StatusPill label={ready ? "ready for API wiring" : "partial draft"} tone={ready ? "success" : "warn"} />
        </div>
      </ShellCard>

      <div className="grid gap-4 xl:grid-cols-3">
        <SummaryBlock title="Interview">
          <div>
            <div className="font-medium">Self summary</div>
            <div>{draft.interview.selfSummary || "Not filled yet."}</div>
          </div>
          <div>
            <div className="font-medium">Core values</div>
            <div>{draft.interview.coreValues || "Not filled yet."}</div>
          </div>
          <div>
            <div className="font-medium">Speaking style</div>
            <div>{draft.interview.speakingStyle || "Not filled yet."}</div>
          </div>
        </SummaryBlock>

        <SummaryBlock title="Voice">
          <div>
            <div className="font-medium">Input mode</div>
            <div>{draft.voice.inputMode}</div>
          </div>
          <div>
            <div className="font-medium">Sample file</div>
            <div>{draft.voice.sampleFileName || "No file selected."}</div>
          </div>
          <div>
            <div className="font-medium">Tone notes</div>
            <div>{draft.voice.toneNotes || "No notes yet."}</div>
          </div>
        </SummaryBlock>

        <SummaryBlock title="Image">
          <div>
            <div className="font-medium">Input mode</div>
            <div>{draft.image.inputMode}</div>
          </div>
          <div>
            <div className="font-medium">Reference file</div>
            <div>{draft.image.referenceFileName || "No file selected."}</div>
          </div>
          <div>
            <div className="font-medium">Visual direction</div>
            <div>{draft.image.visualDirection || "No direction yet."}</div>
          </div>
        </SummaryBlock>
      </div>

      <ShellCard className="bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,248,248,0.95))]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-lg font-semibold tracking-[-0.03em]">Next implementation target</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Wire this draft to a backend submission endpoint and replace local session storage with a real persisted
              job payload.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <NavLink to="/capture/image">
              <Button type="button" variant="outline">
                Back to image step
              </Button>
            </NavLink>
            <Button disabled>Submit to backend (next phase)</Button>
          </div>
        </div>
      </ShellCard>
    </div>
  );
}
