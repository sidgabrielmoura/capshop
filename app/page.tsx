"use client"
import ProductsPageComponent from "@/components/productsComponent"
import { useProducts } from "@/providers/productsProvider"

export default function ProductsPage() {
  const { products, productStatus } = useProducts()

  return (
    <>
      {productStatus === "loading" ? (
        <div className="p-6 animate-pulse">
          <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-300 rounded mb-6"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-0 overflow-hidden">
                <div className="h-40 bg-gray-300"></div>

                {/* Conteúdo */}
                <div className="p-4">
                  {/* Título */}
                  <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>

                  {/* Descrição */}
                  <div className="h-3 w-full bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 w-3/4 bg-gray-300 rounded mb-3"></div>

                  {/* Preço + Botão */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    <div className="h-8 w-20 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ProductsPageComponent products={products} />
      )}
    </>
  )
}
