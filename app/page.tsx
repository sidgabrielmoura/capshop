"use client"
import ProductsPageComponent from "@/components/productsComponent"
import { useProducts } from "@/providers/productsProvider"

export default function ProductsPage() {
  const { products } = useProducts()

  return (
    <ProductsPageComponent products={products} />
  )
}
