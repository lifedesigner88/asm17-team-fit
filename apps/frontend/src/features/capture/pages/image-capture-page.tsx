import { Form, NavLink, useNavigation } from "react-router-dom";

import { Button, Field, Input, ShellCard, StatusPill, Textarea } from "@/common/components";

import { ChoiceCard } from "../components";
import { useCaptureRouteData } from "../utils/hooks";

export function ImageCapturePage() {
  const { draft } = useCaptureRouteData();
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";
  const currentMode = draft.image.inputMode;

  return (
    <ShellCard className="bg-white/92">
      <div className="space-y-2">
        <StatusPill label="Step 3" />
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">Visual references</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          This step captures image intent, not the final upload pipeline. The point is to lock the fields the future
          backend contract will need.
        </p>
      </div>

      <Form className="mt-6 space-y-5" method="post">
        <input name="existingReferenceFileName" type="hidden" value={draft.image.referenceFileName} />
        <div className="grid gap-3 md:grid-cols-3">
          <ChoiceCard
            defaultChecked={currentMode === "upload"}
            description="Use an existing photo or reference image."
            name="inputMode"
            title="Upload reference"
            value="upload"
          />
          <ChoiceCard
            defaultChecked={currentMode === "camera"}
            description="Capture from device camera in a later phase."
            name="inputMode"
            title="Use camera"
            value="camera"
          />
          <ChoiceCard
            defaultChecked={currentMode === "later"}
            description="Proceed with text-only draft for now."
            name="inputMode"
            title="Decide later"
            value="later"
          />
        </div>

        <Field
          hint={draft.image.referenceFileName ? `Current file: ${draft.image.referenceFileName}` : "Only filename metadata is stored in this phase."}
          label="Reference image"
        >
          <Input accept="image/*" name="referenceFile" type="file" />
        </Field>
        <Field hint="Style, mood, era, palette, or artist-adjacent notes." label="Visual direction">
          <Textarea
            defaultValue={draft.image.visualDirection}
            name="visualDirection"
            placeholder="soft editorial portrait, warm neutral palette, restrained contrast..."
          />
        </Field>
        <Field hint="Optional prompt support for pose, crop, angle, and expression." label="Framing notes">
          <Textarea
            defaultValue={draft.image.framingNotes}
            name="framingNotes"
            placeholder="waist-up portrait, eye-level camera, minimal smile, clean background..."
          />
        </Field>

        <div className="flex items-center justify-between gap-3">
          <NavLink to="/capture/voice">
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
