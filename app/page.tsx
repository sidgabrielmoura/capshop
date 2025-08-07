"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, Heart, MoreHorizontal, Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const products = [
  {
    id: 1,
    name: "Smartphone Galaxy Pro",
    description: "Smartphone premium com câmera de 108MP e tela AMOLED de 6.7 polegadas",
    image: "/placeholder.svg?height=200&width=200",
    price: "R$ 2.499,00",
    status: "Ativo",
  },
  {
    id: 2,
    name: "Fone Bluetooth Premium",
    description: "Fone de ouvido sem fio com cancelamento de ruído ativo",
    image: "/placeholder.svg?height=200&width=200",
    price: "R$ 599,00",
    status: "Ativo",
  },
  {
    id: 3,
    name: "Smartwatch Fitness",
    description: "Relógio inteligente com monitoramento de saúde 24/7",
    image: "/placeholder.svg?height=200&width=200",
    price: "R$ 899,00",
    status: "Rascunho",
  },
  {
    id: 4,
    name: "Notebook Gamer RGB",
    description: "Notebook para jogos com placa de vídeo dedicada e teclado RGB",
    image: "/placeholder.svg?height=200&width=200",
    price: "R$ 4.299,00",
    status: "Ativo",
  },
]

export default function ProductsPage() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Seus Produtos</h1>
        <p className="text-gray-600">Gerencie todos os seus produtos em um só lugar</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group min-w-[300px] overflow-hidden bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-8 h-8 bg-white/90 hover:bg-white"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary" className="w-8 h-8 bg-white/90 hover:bg-white">
                      <MoreHorizontal className="w-4 h-4 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-purple-600">{product.price}</span>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Detalhes
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
            <Package className="w-12 h-12 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-600 mb-6">Comece criando seu primeiro produto</p>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Criar Produto
          </Button>
        </div>
      )}
    </div>
  )
}
