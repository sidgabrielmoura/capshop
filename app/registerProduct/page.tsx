"use client"
import NewProductComponent from "@/components/registerProductContent"
import type React from "react"
import { Suspense } from "react"

export default function NewProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewProductComponent />
    </Suspense>
  )
}
