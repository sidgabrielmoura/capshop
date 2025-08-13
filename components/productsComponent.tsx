"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, Heart, MoreHorizontal, Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Prisma } from "@/lib/generated/prisma"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ProductsPageProps {
    products: Prisma.ProductGetPayload<{
        include: {
            generatedContent: true,
            images: true,
        }
    }>[]
}

export default function ProductsPageComponent({ products }: ProductsPageProps) {
    const [favorites, setFavorites] = useState<number[]>([])
    const [deletingProduct, setDeletingProduct] = useState<string[]>([])
    const router = useRouter()

    const toggleFavorite = (productId: number) => {
        setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
    }

    const navigateTo = (path: string) => {
        router.push(path)
    }

    const handleDeleteProduct = async (productId: string) => {
        setDeletingProduct([...deletingProduct, productId])
        try {
            const response = await fetch('/api/delete-product', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: productId })
            })

            if (!response.ok) {
                toast.error('erro ao deletar produto ou produto inexistente')
                setTimeout(() => {
                    setDeletingProduct([])
                }, 1000)
                return
            }

            toast.success('produto deletado com sucesso', {
                action: {
                    label: 'atualizar',
                    onClick: () => {
                        window.location.reload()
                    }
                }
            })
        } catch (error) {
            console.log(error)
            setTimeout(() => {
                setDeletingProduct([])
            }, 1000)
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Seus Produtos</h1>
                <p className="text-gray-600">Gerencie todos os seus produtos em um só lugar</p>
            </div>

            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-6">
                {products.length > 0 && (
                    <>
                        {products.map((product, i) => (
                            <Card
                                key={product.id}
                                className={`
                                    group overflow-hidden bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 
                                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1 p-0 pb-3
                                    ${deletingProduct.includes(product.id) ? "opacity-50 pointer-events-none scale-95" : ""}
                                `}
                            >
                                <div className="relative">
                                    <Image
                                        src={product.images[0].url}
                                        alt={product.name}
                                        width={200}
                                        height={200}
                                        className="w-full h-56 object-cover"
                                    />
                                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="w-8 h-8 bg-white/90 hover:bg-white"
                                            onClick={() => toggleFavorite(i)}
                                        >
                                            <Heart
                                                className={`w-4 h-4 ${favorites.includes(i) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
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
                                                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => handleDeleteProduct(product.id)}>Excluir</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === 'active' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {product.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-2">
                                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                                    <div className="flex items-center justify-between mt-6">
                                        <span className="text-lg font-bold text-purple-600">R$ {product.price.toFixed(2)}</span>
                                        <Button
                                            onClick={() => {
                                                router.push(`/products/${product.id}`)
                                            }}
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
                    </>
                )}
            </div>

            {products.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
                    <p className="text-gray-600 mb-6">Comece criando seu primeiro produto</p>
                    <Button onClick={() => navigateTo('/registerProduct')} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Produto
                    </Button>
                </div>
            )}
        </div>
    )
}
