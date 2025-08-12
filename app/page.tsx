"use client"
import ProductsPageComponent from "@/components/productsComponent"
import { UserSession } from "@/interfaces"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const { data: usesession, status } = useSession()
  const session = usesession?.user as UserSession

  useEffect(() => {
    if (status === 'authenticated' && session?.id) {
      const fetchProducts = async () => {
        try {
          const res = await fetch("/api/list-products");
          const data = await res.json();
          setProducts(data);
        } catch (error) {
          console.error("Erro no fetchProducts", error);
        }
      };
      fetchProducts();
    } else if (status === 'unauthenticated') {
      console.log("Usuário não autenticado.");
    }
  }, [status, session?.id])

  return (
    <ProductsPageComponent products={products} />
  )
}
