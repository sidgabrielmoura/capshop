"use client"
import PaymentCancelledPage from "@/components/cancelContent";
import { Suspense } from "react";

export default function cancelPage() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentCancelledPage/>
        </Suspense>
    )    
}
