"use client"
import PaymentSuccessPage from "@/components/successContent";
import { Suspense } from "react";

export default function successPage() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentSuccessPage/>
        </Suspense>
    )    
}
