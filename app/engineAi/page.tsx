import AIConfigPage from "@/components/engineAiContent";
import { Suspense } from "react";

export default function EngineAiPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AIConfigPage />
    </Suspense>
  )
}