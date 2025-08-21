"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { UserSession } from "@/interfaces"

type ProductStatus = "idle" | "loading" | "success" | "error" | "unauthorized"

type ProductsContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[]
  fetchProducts: (search?: string, quickSearch?: string) => void
  productStatus: ProductStatus
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([])
  const [productStatus, setProductStatus] = useState<ProductStatus>("idle")
  const { data: usesession, status } = useSession()
  const session = usesession?.user as UserSession

  const fetchProducts = async (search = "", quickSearch = "") => {
    if (!session || status !== "authenticated") {
      setProducts([])
      setProductStatus("unauthorized")
      return
    }

    setProductStatus("loading")

    if (quickSearch === "favorites") {
      const storedFavorites = localStorage.getItem("favorites")
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites) as string[]
        setProducts((prev) => prev.filter((p) => favoriteIds.includes(p.id)))
      } else {
        setProducts([])
      }
      setProductStatus("success")
      return
    }

    try {
      const url =
        search.length >= 3
          ? `/api/list-products?search=${search}`
          : quickSearch
          ? `/api/list-products?search=${quickSearch}`
          : "/api/list-products"

      const res = await fetch(url)
      const data = await res.json()
      setProducts(data)
      setProductStatus("success")
    } catch (err) {
      console.error("Erro ao buscar produtos:", err)
      setProductStatus("error")
    }
  }

  useEffect(() => {
    if (session && status === "authenticated") {
      fetchProducts()
    } else if (status !== "loading") {
      setProducts([])
      setProductStatus("unauthorized")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  return (
    <ProductsContext.Provider value={{ products, fetchProducts, productStatus }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error("useProducts deve ser usado dentro de ProductsProvider")
  return ctx
}
