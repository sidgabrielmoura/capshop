"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { UserSession } from "@/interfaces"

type ProductsContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[]
  fetchProducts: (search?: string) => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([])
  const { data: usesession, status } = useSession()
  const session = usesession?.user as UserSession

  const fetchProducts = async (search = "") => {
    if (status !== "authenticated" || !session?.id) return

    try {
      const url = search ? `/api/list-products?search=${search}` : "/api/list-products"
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error("Erro ao buscar produtos:", err)
    }
  }

  // carrega todos ao montar
  useEffect(() => {
    if (status === "authenticated" && session?.id) {
      fetchProducts()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.id])

  return (
    <ProductsContext.Provider value={{ products, fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error("useProducts deve ser usado dentro de ProductsProvider")
  return ctx
}
