"use client"

import { useEffect, useState } from "react"
import {
    ArrowLeft,
    Heart,
    Share2,
    Edit,
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { GeneratedContent, Product, Image as Images } from "@/lib/generated/prisma"
import { createNotification } from "@/actions"
import { useSession } from "next-auth/react"

interface ProductWithRelations extends Product {
    images: Images[];
    generatedContent: GeneratedContent[];
}

export default function ProductDetailsComponent({ productId }: { productId: string }) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [loading, setLoading] = useState(false)
    const [productData, setProductData] = useState<ProductWithRelations | null>(null)
    const user = useSession().data?.user

    const discount = productData && Math.round(((productData?.originPrice - productData?.price) / productData?.originPrice) * 100)

    const nextImage = () => {
        if (productData)
            setSelectedImage((prev) => (prev + 1) % productData.images.length)
    }

    const prevImage = () => {
        if (productData)
            setSelectedImage((prev) => (prev - 1 + productData.images.length) % productData.images.length)
    }

    const navigateTo = (path: string) => {
        route.push(path)
    }


    const id = productId
    const route = useRouter()
    useEffect(() => {
        if (!id) return

        const findProduct = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/product?id=${id}`)

                if (!response.ok) {
                    toast.error('Produto não encontrado')
                    navigateTo('/')
                    return
                }

                const product = await response.json();
                setProductData(product);
                console.log(productData)
            } catch (error) {
                console.log(error)
                navigateTo('/')
            } finally {
                setLoading(false)
            }
        }

        findProduct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleDeleteProduct = async (productId: string) => {
        try {
            const response = await fetch('/api/delete-product', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: productId })
            })

            if (!response.ok) {
                toast.error('erro ao deletar produto ou produto inexistente')
                return
            }

            toast.success('produto deletado com sucesso')
            route.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    const handleToogleStateProduct = async (productId: string, status: string) => {
        try {
            const response = await fetch('/api/product', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: productId,
                    status: status === 'active' ? 'draft' : 'active'
                })
            })

            if (!response.ok) {
                toast.error('erro ao desativar produto ou produto inexistente')
                return
            }

            if(status === 'active'){
                createNotification({
                    userId: user?.id || "",
                    title: "Produto Desativado",
                    message: `Você desativou o produto ${productId}`,
                    type: "DISABLE_PRODUCT"
                })
            }else {
                createNotification({
                    userId: user?.id || "",
                    title: "Produto Ativado",
                    message: `Você ativou o produto ${productId}`,
                    type: "ENABLE_PRODUCT"
                })
            }

            toast.success(`Produto ${status === 'active' ? 'desativado' : 'ativado'} com sucesso`, {
                action: {
                    label: "Atualizar",
                    onClick: () => {
                        window.location.reload()
                    }
                }
            })
            route.push('/')
        } catch (error) {
            console.log(error)
            toast.error('Erro ao desativar produto')
        }
    }

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Breadcrumb */}
            {productData && !loading && (
                <>
                    <div className="mb-6">
                        <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 text-sm lg:text-md">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar aos produtos
                        </Link>
                        <nav className="text-sm text-gray-600">
                            <span>Produtos</span>
                            <span className="mx-2">/</span>
                            <span>{productData.category}</span>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900 font-medium">{productData.name}</span>
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Galeria de Fotos */}
                        <div className="space-y-4">
                            {/* Imagem Principal */}
                            <div className="relative bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl overflow-hidden">
                                <div className="aspect-square relative">
                                    <Image
                                        src={productData.images[selectedImage].url || "/placeholder.svg"}
                                        alt={productData.name}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Navegação Mobile */}
                                    <div className="lg:hidden absolute inset-0 flex items-center justify-between p-4">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="w-10 h-10 bg-white/90 hover:bg-white shadow-lg"
                                            onClick={prevImage}
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="w-10 h-10 bg-white/90 hover:bg-white shadow-lg"
                                            onClick={nextImage}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    {/* Indicadores Mobile */}
                                    <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {productData.images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${index === selectedImage ? "bg-white" : "bg-white/50"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Actions Overlay */}
                                    <div className="absolute top-4 right-4 flex space-x-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="w-10 h-10 bg-white/90 hover:bg-white shadow-lg"
                                            onClick={() => setIsFavorite(!isFavorite)}
                                        >
                                            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                                        </Button>
                                        <Button size="icon" variant="secondary" className="w-10 h-10 bg-white/90 hover:bg-white shadow-lg">
                                            <Share2 className="w-5 h-5 text-gray-600" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnails - Desktop */}
                            <div className="hidden lg:grid grid-cols-5 gap-3">
                                {productData.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${index === selectedImage
                                            ? "border-purple-500 ring-2 ring-purple-200"
                                            : "border-white/30 hover:border-purple-300"
                                            }`}
                                    >
                                        <Image
                                            src={image.url || "/placeholder.svg"}
                                            alt={`${productData.name} ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Informações do Produto */}
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge
                                        className={productData.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                                    >
                                        {productData.status === 'active' ? 'Ativo' : 'Rascunho'}
                                    </Badge>
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                        {productData.category}
                                    </Badge>
                                </div>

                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">{productData.name}</h1>

                                {/* Preço */}
                                <div className="flex items-center gap-3 mb-4">
                                    {productData.originPrice > productData.price && (
                                        <span className="text-xl text-gray-500 line-through">
                                            R$ {productData.originPrice.toFixed(2).replace(".", ",")}
                                        </span>
                                    )}
                                    <span className="text-3xl lg:text-4xl font-bold text-green-600">
                                        R$ {productData.price.toFixed(2).replace(".", ",")}
                                    </span>
                                    {discount && discount > 0 && <Badge className="bg-red-100 text-red-700 text-sm">{discount}% OFF</Badge>}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div>Criado em {new Date(productData.createdAt).toLocaleDateString("pt-BR")}</div>
                                </div>
                            </div>

                            <Separator className="bg-white/30" />

                            {/* Descrição */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h2>
                                <p className="text-gray-700 leading-relaxed">{productData.description}</p>
                            </div>

                            {/* Especificações */}
                            {productData.specifications.length > 0 && (
                                <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/30">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificações</h3>
                                    <div>
                                        {Object.entries(productData.specifications).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex justify-between items-center py-2 px-2 gap-4"
                                            >
                                                <span className="text-gray-900 bg-blue-100 p-2 w-full rounded-lg">{value.split(": ")[0]}</span>
                                                <span className="text-gray-900 bg-blue-100 p-2 w-full rounded-lg">{value.split(": ")[1]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Actions */}
                            <div className="space-y-3 flex gap-2">
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <Button onClick={() => handleToogleStateProduct(productData.id, productData.status)} className="cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                                        <Edit className="w-4 h-4 mr-2" />
                                        {productData.status === 'active' ? 'Desativar Produto' : 'Ativar Produto'}
                                    </Button>
                                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-white/50">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Visualizar Anúncio
                                    </Button>
                                </div>

                                <div className="flex gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon" className="bg-white/50 border-white/30 hover:bg-white/70">
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleDeleteProduct(productData.id)} className="text-red-600 focus:text-red-600 cursor-pointer">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Excluir Produto
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Preview Platforms */}
                        </div>
                    </div>
                    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200/50 w-full mt-10">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Onde seu produto aparece</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {["Instagram", "Mercado Livre", "OLX", "Shopee"].map((platform) => (
                                <div key={platform} className="text-center">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                                        <span className="text-xs font-medium text-gray-600">{platform[0]}</span>
                                    </div>
                                    <span className="text-xs text-gray-600">{platform}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
}
