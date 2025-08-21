import SubscriptionComponent from "@/components/planViewContent";
import { Suspense } from "react";

export default function SubscriptionPage() {
    <Suspense fallback={<div>Loading...</div>}>
        <SubscriptionComponent />
    </Suspense>
}