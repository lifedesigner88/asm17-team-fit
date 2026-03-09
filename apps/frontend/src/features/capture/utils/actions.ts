import { redirect } from "react-router-dom";

import { clearCaptureDraft, getCompletion, getNextPath, readCaptureDraft, readFileName, saveDraft } from "./storage";
import type { CaptureLoaderData } from "./types";

export function captureLoader(): CaptureLoaderData {
  const draft = readCaptureDraft();
  const completion = getCompletion(draft);
  return {
    draft,
    completion,
    progressCount: Object.values(completion).filter(Boolean).length,
    nextPath: getNextPath(completion),
  };
}

export async function interviewAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const draft = readCaptureDraft();

  saveDraft({
    ...draft,
    interview: {
      selfSummary: String(formData.get("selfSummary") ?? "").trim(),
      coreValues: String(formData.get("coreValues") ?? "").trim(),
      speakingStyle: String(formData.get("speakingStyle") ?? "").trim(),
      keywords: String(formData.get("keywords") ?? "").trim(),
    },
  });

  return redirect("/capture/voice");
}

export async function voiceAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const draft = readCaptureDraft();
  const existingFileName = String(formData.get("existingSampleFileName") ?? "").trim();

  saveDraft({
    ...draft,
    voice: {
      inputMode: String(formData.get("inputMode") ?? "later").trim() as (typeof draft.voice)["inputMode"],
      sampleFileName: readFileName(formData.get("sampleFile"), existingFileName),
      toneNotes: String(formData.get("toneNotes") ?? "").trim(),
      deliveryGoal: String(formData.get("deliveryGoal") ?? "").trim(),
    },
  });

  return redirect("/capture/image");
}

export async function imageAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const draft = readCaptureDraft();
  const existingFileName = String(formData.get("existingReferenceFileName") ?? "").trim();

  saveDraft({
    ...draft,
    image: {
      inputMode: String(formData.get("inputMode") ?? "later").trim() as (typeof draft.image)["inputMode"],
      referenceFileName: readFileName(formData.get("referenceFile"), existingFileName),
      visualDirection: String(formData.get("visualDirection") ?? "").trim(),
      framingNotes: String(formData.get("framingNotes") ?? "").trim(),
    },
  });

  return redirect("/capture/review");
}

export async function resetCaptureAction() {
  clearCaptureDraft();
  return redirect("/capture");
}
