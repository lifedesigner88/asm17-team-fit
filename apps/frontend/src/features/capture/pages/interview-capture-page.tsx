import { Form, NavLink, useNavigation } from "react-router-dom";

import { Button, Field, Input, ShellCard, StatusPill, Textarea } from "@/common/components";

import { useCaptureRouteData } from "../utils/hooks";

export function InterviewCapturePage() {
  const { draft } = useCaptureRouteData();
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";

  return (
    <ShellCard className="bg-white/92">
      <div className="space-y-2">
        <StatusPill label="Step 1" />
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">Interview frame</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Start with the text layer. This will later drive persona extraction and prompt construction.
        </p>
      </div>

      <Form className="mt-6 space-y-5" method="post">
        <Field hint="Two or three lines are enough for now." label="How does the user describe themselves?">
          <Textarea defaultValue={draft.interview.selfSummary} name="selfSummary" placeholder="Calm, analytical, optimistic..." required />
        </Field>
        <Field hint="Comma-separated or short sentences both work." label="Core values">
          <Textarea defaultValue={draft.interview.coreValues} name="coreValues" placeholder="curiosity, consistency, kindness..." required />
        </Field>
        <Field hint="This becomes useful for tone/persona conditioning later." label="Speaking style">
          <Textarea
            defaultValue={draft.interview.speakingStyle}
            name="speakingStyle"
            placeholder="Direct but warm, slow pacing, avoids slang..."
            required
          />
        </Field>
        <Field hint="Optional shorthand for quick scanning." label="Keywords">
          <Input defaultValue={draft.interview.keywords} name="keywords" placeholder="gentle, precise, reflective" />
        </Field>
        <div className="flex items-center justify-between gap-3">
          <NavLink to="/capture">
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
