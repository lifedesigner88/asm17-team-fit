import { EMPTY_DRAFT, type CaptureCompletion, type CaptureDraft } from "./types";

const CAPTURE_DRAFT_KEY = "persona-mirror.capture-draft.v1";

export function readCaptureDraft(): CaptureDraft {
  if (typeof window === "undefined") {
    return EMPTY_DRAFT;
  }

  const raw = window.sessionStorage.getItem(CAPTURE_DRAFT_KEY);
  if (!raw) {
    return EMPTY_DRAFT;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CaptureDraft>;
    return {
      interview: {
        ...EMPTY_DRAFT.interview,
        ...parsed.interview,
      },
      voice: {
        ...EMPTY_DRAFT.voice,
        ...parsed.voice,
      },
      image: {
        ...EMPTY_DRAFT.image,
        ...parsed.image,
      },
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

export function writeCaptureDraft(draft: CaptureDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(CAPTURE_DRAFT_KEY, JSON.stringify(draft));
}

export function clearCaptureDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(CAPTURE_DRAFT_KEY);
}

export function saveDraft(nextDraft: CaptureDraft) {
  writeCaptureDraft({
    ...nextDraft,
    updatedAt: new Date().toISOString(),
  });
}

export function getCompletion(draft: CaptureDraft): CaptureCompletion {
  const interviewDone =
    draft.interview.selfSummary.trim().length > 0 &&
    draft.interview.coreValues.trim().length > 0 &&
    draft.interview.speakingStyle.trim().length > 0;

  const voiceDone =
    draft.voice.inputMode === "later" ||
    draft.voice.sampleFileName.trim().length > 0 ||
    draft.voice.toneNotes.trim().length > 0;

  const imageDone =
    draft.image.inputMode === "later" ||
    (draft.image.visualDirection.trim().length > 0 &&
      (draft.image.referenceFileName.trim().length > 0 || draft.image.framingNotes.trim().length > 0));

  return {
    interview: interviewDone,
    voice: voiceDone,
    image: imageDone,
  };
}

export function getNextPath(completion: CaptureCompletion) {
  if (!completion.interview) {
    return "/capture/interview";
  }
  if (!completion.voice) {
    return "/capture/voice";
  }
  if (!completion.image) {
    return "/capture/image";
  }
  return "/capture/review";
}

export function readFileName(entry: FormDataEntryValue | null, fallback = "") {
  if (entry instanceof File && entry.size > 0) {
    return entry.name;
  }
  return fallback;
}
