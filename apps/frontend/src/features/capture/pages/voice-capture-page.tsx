import { Form, NavLink, useNavigation } from "react-router-dom";

import { Button, Field, Input, ShellCard, StatusPill, Textarea } from "@/common/components";

import { ChoiceCard } from "../components";
import { useCaptureRouteData } from "../utils/hooks";

export function VoiceCapturePage() {
  const { draft } = useCaptureRouteData();
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";
  const currentMode = draft.voice.inputMode;

  return (
    <ShellCard className="bg-white/92">
      <div className="space-y-2">
        <StatusPill label="Step 2" />
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">Voice intent</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          The real upload and recording pipeline will come later. For now, decide how voice will enter the system and
          capture the intended tone.
        </p>
      </div>

      <Form className="mt-6 space-y-5" method="post">
        <input name="existingSampleFileName" type="hidden" value={draft.voice.sampleFileName} />
        <div className="grid gap-3 md:grid-cols-3">
          <ChoiceCard
            defaultChecked={currentMode === "upload"}
            description="User will provide an existing sample file."
            name="inputMode"
            title="Upload file"
            value="upload"
          />
          <ChoiceCard
            defaultChecked={currentMode === "record"}
            description="User will record directly in the browser later."
            name="inputMode"
            title="Record in app"
            value="record"
          />
          <ChoiceCard
            defaultChecked={currentMode === "later"}
            description="Skip media for now and rely on interview intent."
            name="inputMode"
            title="Decide later"
            value="later"
          />
        </div>

        <Field hint={draft.voice.sampleFileName ? `Current file: ${draft.voice.sampleFileName}` : "Metadata only for now."} label="Voice sample file">
          <Input accept="audio/*" name="sampleFile" type="file" />
        </Field>
        <Field hint="Describe pacing, energy, warmth, sharpness, or emotional tone." label="Tone notes">
          <Textarea defaultValue={draft.voice.toneNotes} name="toneNotes" placeholder="Soft start, crisp articulation, low dramatic variance..." />
        </Field>
        <Field hint="Optional target for later TTS/style transfer." label="Delivery goal">
          <Input defaultValue={draft.voice.deliveryGoal} name="deliveryGoal" placeholder="clear onboarding narrator, calm peer mentor..." />
        </Field>

        <div className="flex items-center justify-between gap-3">
          <NavLink to="/capture/interview">
            <Button type="button" variant="outline">
              Back
            </Button>
          </NavLink>
          <Button disabled={loading} type="submit">
            {loading ? "Saving..." : "Save and continue"}
          </Button>
        </div>
      </Form>
    </ShellCard>
  );
}
