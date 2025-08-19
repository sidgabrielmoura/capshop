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
import { signIn, useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { createNotification } from "@/actions"

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
    const user = useSession().data?.user

    const toggleFavorite = (productId: number) => {
        setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
    }

    const navigateTo = (path: string) => {
        router.push(path)
    }

    const handleDeleteProduct = async (productId: string, productName: string) => {
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

            await createNotification({
                userId: user?.id || "",
                title: "Produto Deletado",
                message: `Você deletou o produto ${productName}.`,
                type: "DELETE_PRODUCT"
            })

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

    const handleLogin = async () => {
        await signIn("google")
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
                                                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => handleDeleteProduct(product.id, product.name)}>Excluir</DropdownMenuItem>
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
                    {user ? (
                        <Button onClick={() => navigateTo('/registerProduct')} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Produto
                        </Button>
                    ) : (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Criar Produto
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md w-full">
                                <DialogHeader>
                                    <DialogTitle className="text-center text-2xl font-bold">Bem-vindo</DialogTitle>
                                    <DialogDescription className="text-center text-gray-500">
                                        Faça login para continuar usando a plataforma
                                    </DialogDescription>
                                </DialogHeader>

                                <Button
                                    onClick={handleLogin}
                                    variant="outline"
                                    className="flex items-center justify-center gap-2 border-gray-300 py-2 cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-zinc-50 hover:text-zinc-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 128 128"><path fill="currentColor" d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.3 74.3 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.2 36.2 0 0 1-13.93 5.5a41.3 41.3 0 0 1-15.1 0A37.2 37.2 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.3 38.3 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.3 34.3 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.2 61.2 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38" /></svg>
                                    Entrar com Google
                                </Button>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            )}
        </div>
    )
}
