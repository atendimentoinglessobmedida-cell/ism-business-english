import { notFound } from "next/navigation";
import SpeakingLabPilot from "../../../speaking-lab/pilot";

/**
 * Development-only preview. Never expose an unauthenticated speaking module
 * to students through production or staging routes.
 */
export default function SpeakingLabPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <SpeakingLabPilot />;
}
