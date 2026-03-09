import { useRouteLoaderData } from "react-router-dom";

import type { CaptureLoaderData } from "./types";

export function useCaptureRouteData() {
  return useRouteLoaderData("capture") as CaptureLoaderData;
}
