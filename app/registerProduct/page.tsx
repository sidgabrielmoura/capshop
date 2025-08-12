"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Upload, Sparkles, Check, X, Loader, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PricingModal } from "@/components/pricingModal"
import Link from "next/link"
import Image from "next/image"
import { ImageInput } from "@/interfaces"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

const steps = [
  { id: 1, name: "Fotos", description: "Imagens do produto" },
  { id: 2, name: "Categoria", description: "Tipo do produto" },
  { id: 3, name: "Nome", description: "Título do produto" },
  { id: 4, name: "Descrição", description: "Detalhes do produto" },
  { id: 5, name: "Especificações", description: "Características técnicas" },
  { id: 6, name: "Preço", description: "Valor do produto" },
  { id: 7, name: "Preview", description: "Visualização final" },
  { id: 8, name: "Sucesso", description: "Produto criado" },
]

const categories = [
  { id: "eletronicos", name: "Eletrônicos", icon: "📱", description: "Smartphones, tablets, notebooks" },
  { id: "moda", name: "Moda e Vestuário", icon: "👗", description: "Roupas, sapatos, acessórios" },
  { id: "casa", name: "Casa e Decoração", icon: "🏠", description: "Móveis, decoração, utilidades" },
  { id: "beleza", name: "Beleza e Cuidados", icon: "💄", description: "Cosméticos, perfumes, cuidados" },
  { id: "esportes", name: "Esportes e Fitness", icon: "⚽", description: "Equipamentos, roupas esportivas" },
  { id: "livros", name: "Livros e Educação", icon: "📚", description: "Livros, cursos, materiais" },
  { id: "brinquedos", name: "Brinquedos e Jogos", icon: "🎮", description: "Brinquedos, jogos, hobbies" },
  { id: "automotivo", name: "Automotivo", icon: "🚗", description: "Peças, acessórios, ferramentas" },
]

export default function NewProductPage() {
  const user = useSession().data?.user
  const [currentStep, setCurrentStep] = useState(1)
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [productData, setProductData] = useState({
    images: [] as ImageInput[],
    name: "",
    category: "", //ADD TO SCHEMA
    description: "",
    specifications: [] as string[], //ADD TO SCHEMA
    price: "",
    origin_price: "",
  })
  const [loadingRegisterProduct, setLoadingRegisterProduct] = useState(false)

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    const newImages = files.map((file) => URL.createObjectURL(file))
    const newImageObjects = newImages.map(url => ({ url }))

    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageObjects].slice(0, 10),
    }))
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateWithAI = (field: "name" | "description") => {
    // Simular verificação de premium - abrir modal
    setIsPricingOpen(true)
  }

  async function convertBlobUrlToBase64(blobUrl: string) {
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const addSpecification = () => {
    const key = prompt("Nome da especificação:")
    const value = prompt("Valor da especificação:")
    if (key && value) {
      setProductData((prev) => ({
        ...prev,
        specifications: { ...prev.specifications, [key]: value },
      }))
    }
  }

  // const removeSpecification = (key: string) => {
  //   setProductData((prev) => ({
  //     ...prev,
  //     specifications: Object.fromEntries(Object.entries(prev.specifications).filter(([k]) => k !== key)),
  //   }))
  // }

  const selectedCategory = categories.find((cat) => cat.id === productData.category)

  async function handleCreateProduct() {
    setLoadingRegisterProduct(true)
    const processedImages = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      productData.images.map(async (img: any) => {
        if (typeof img.url === "string" && img.url.startsWith("blob:")) {
          // Converte blob: para Base64
          const base64 = await convertBlobUrlToBase64(img.url);
          return { base64 };
        }
        return img;
      })
    );

    const specificationsArray = Object.entries(productData.specifications).map(
      ([key, value]) => `${key}: ${value}`
    );

    const response = await fetch("/api/new-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: productData.name,
        category: productData.category,
        specifications: specificationsArray,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userId: (user as any).id,
        description: productData.description,
        price: Number(productData.price),
        originPrice: Number(productData.origin_price),
        images: processedImages
      })
    });

    setLoadingRegisterProduct(false)

    if (response.ok) {
      nextStep()
      return
    }

    toast.error('Ocorreu um erro ao criar o produto')
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos produtos
        </Link>
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">Criar Novo Produto</h1>
          <p className="text-gray-600 text-lg">Siga os passos para criar seu produto perfeito</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 lg:mb-12">
        {/* Mobile Progress - Simplified */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              <span className="text-sm font-medium text-purple-600">
                Passo {currentStep} de {steps.length}
              </span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-gray-800">{steps[currentStep - 1]?.name}</h3>
            <p className="text-sm text-gray-600">{steps[currentStep - 1]?.description}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop Progress - Full */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${currentStep >= step.id
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 border-transparent text-white shadow-lg"
                    : currentStep === step.id - 1
                      ? "border-purple-300 text-purple-600 bg-purple-50"
                      : "border-gray-300 text-gray-500"
                    }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-bold">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${currentStep > step.id ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-300"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-2 text-center">
            {steps.map((step) => (
              <div key={step.id} className="min-w-0">
                <p
                  className={`text-sm font-medium truncate ${currentStep >= step.id ? "text-purple-700" : "text-gray-600"}`}
                >
                  {step.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/30">
        {currentStep === 1 && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">
                Adicione as Fotos
              </h2>
              <p className="text-gray-600 text-base lg:text-lg">Mostre seu produto com até 10 fotos incríveis</p>
            </div>

            <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 sm:p-8 lg:p-12 mb-6 lg:mb-8 hover:border-purple-400 transition-all duration-300 hover:bg-purple-50/50">
              <Upload className="w-12 h-12 lg:w-16 lg:h-16 text-purple-500 mx-auto mb-4 lg:mb-6" />
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2 lg:mb-3">Arraste suas fotos aqui</h3>
              <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">ou clique para selecionar arquivos</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white p-0 lg:px-8 text-sm lg:text-base"
              >
                <label htmlFor="image-upload" className="px-10 py-1 flex items-center gap-2">
                  <Upload className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Selecionar Fotos
                </label>
              </Button>
            </div>

            {productData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
                {productData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`Produto ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full aspect-square object-cover rounded-xl border-2 border-white/50"
                    />
                    <Badge className="absolute -top-2 -left-2 bg-purple-500 text-white text-xs">{index + 1}</Badge>
                    <Badge onClick={() => {
                      const newImages = productData.images.filter((_, i) => i !== index)
                      setProductData({ images: newImages, name: '', description: '', price: '', origin_price: '', specifications: [], category: '' })
                    }} className="absolute py-2 cursor-pointer -top-2 -right-2 bg-purple-500"><X /></Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">
                Escolha a Categoria
              </h2>
              <p className="text-gray-600 text-base lg:text-lg">
                Selecione o tipo do seu produto para melhor organização
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setProductData((prev) => ({ ...prev, category: category.id }))}
                  className={`p-4 lg:p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 ${productData.category === category.id
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg"
                    : "border-white/40 bg-white/50 hover:border-purple-300 hover:bg-white/70"
                    }`}
                >
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="text-2xl lg:text-3xl">{category.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-base lg:text-lg mb-1 lg:mb-2">{category.name}</h3>
                      <p className="text-gray-600 text-xs lg:text-sm">{category.description}</p>
                    </div>
                    {productData.category === category.id && (
                      <div className="w-5 h-5 lg:w-6 lg:h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">
                Nome do Produto
              </h2>
              <p className="text-gray-600 text-base lg:text-lg">Crie um título atrativo que chame atenção</p>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Ex: Smartphone Galaxy Pro Max Ultra..."
                  value={productData.name}
                  onChange={(e) => setProductData((prev) => ({ ...prev, name: e.target.value }))}
                  className="flex-1 h-12 lg:h-14 text-base lg:text-lg bg-white/70 border-white/50 focus:bg-white/90"
                />
                <Button
                  onClick={() => generateWithAI("name")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 lg:px-6 h-12 lg:h-14 w-full sm:w-auto"
                >
                  <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  IA
                </Button>
              </div>

              {productData.name && (
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-700 mb-1">Preview do título:</p>
                      <p className="font-semibold text-gray-800 text-lg">{productData.name}</p>
                    </div>
                  </div>
                </Card>
              )}

              <div className="bg-blue-50 p-6 rounded-2xl">
                <h3 className="font-semibold text-blue-800 mb-3">💡 Dicas para um bom título:</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Use palavras-chave que as pessoas procuram</li>
                  <li>• Inclua características principais (cor, tamanho, modelo)</li>
                  <li>• Seja específico mas não muito longo</li>
                  <li>• Evite caracteres especiais desnecessários</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Descrição do Produto</h2>
              <p className="text-gray-600 text-lg">Conte todos os detalhes e benefícios</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3 items-start">
                <Textarea
                  placeholder="Descreva seu produto de forma detalhada: características, benefícios, como usar..."
                  value={productData.description}
                  onChange={(e) => setProductData((prev) => ({ ...prev, description: e.target.value }))}
                  className="flex-1 min-h-40 text-base bg-white/70 border-white/50 focus:bg-white/90 resize-none"
                />
                <Button
                  onClick={() => generateWithAI("description")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  IA
                </Button>
              </div>

              {productData.description && (
                <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-700 mb-2">Preview da descrição:</p>
                      <p className="text-gray-800 leading-relaxed">{productData.description}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Especificações Técnicas</h2>
              <p className="text-gray-600 text-lg">Adicione detalhes técnicos importantes</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <Button
                  onClick={addSpecification}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Especificação
                </Button>
              </div>

              {Object.keys(productData.specifications).length > 0 && (
                <Card className="p-6 bg-white/70 border-white/50">
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">Especificações Adicionadas:</h3>
                  <div className="space-y-3">
                    {Object.entries(productData.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-gray-700">{key}:</span>
                          <span className="ml-2 text-gray-900">{value}</span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          // onClick={() => removeSpecification(key)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <div className="bg-yellow-50 p-6 rounded-2xl">
                <h3 className="font-semibold text-yellow-800 mb-3">💡 Exemplos de especificações:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                  <div>
                    <p className="font-medium mb-2">Eletrônicos:</p>
                    <ul className="space-y-1">
                      <li>• Tela: 6.7&quot; AMOLED</li>
                      <li>• Processador: Snapdragon 8</li>
                      <li>• Memória: 8GB RAM</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Roupas:</p>
                    <ul className="space-y-1">
                      <li>• Material: 100% Algodão</li>
                      <li>• Tamanhos: P, M, G, GG</li>
                      <li>• Cores: Azul, Preto, Branco</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">Defina o Preço</h2>
              <p className="text-gray-600 text-base lg:text-lg">Estabeleça um valor competitivo</p>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2 lg:mb-3">
                    Preço de Venda *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base lg:text-lg font-medium">
                      R$
                    </span>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={productData.price}
                      onChange={(e) => setProductData((prev) => ({ ...prev, price: e.target.value }))}
                      className="pl-10 lg:pl-12 h-12 lg:h-14 text-base lg:text-lg bg-white/70 border-white/50 focus:bg-white/90"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2 lg:mb-3">
                    Preço Original (opcional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base lg:text-lg font-medium">
                      R$
                    </span>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={productData.origin_price}
                      onChange={(e) => setProductData((prev) => ({ ...prev, origin_price: e.target.value }))}
                      className="pl-10 lg:pl-12 h-12 lg:h-14 text-base lg:text-lg bg-white/70 border-white/50 focus:bg-white/90"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <p className="text-xs lg:text-sm text-gray-500 mt-2">Para mostrar desconto</p>
                </div>
              </div>

              {productData.price && (
                <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-green-800">Preview do preço:</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {productData.origin_price &&
                      Number.parseFloat(productData.origin_price) > Number.parseFloat(productData.price) && (
                        <span className="text-xl text-gray-500 line-through">
                          R$ {Number.parseFloat(productData.origin_price).toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    <span className="text-3xl font-bold text-green-600">
                      R$ {Number.parseFloat(productData.price).toFixed(2).replace(".", ",")}
                    </span>
                    {productData.origin_price &&
                      Number.parseFloat(productData.origin_price) > Number.parseFloat(productData.price) && (
                        <Badge className="bg-red-500 text-white text-sm">
                          {Math.round(
                            ((Number.parseFloat(productData.origin_price) - Number.parseFloat(productData.price)) /
                              Number.parseFloat(productData.origin_price)) *
                            100,
                          )}
                          % OFF
                        </Badge>
                      )}
                  </div>
                </Card>
              )}

              <div className="bg-blue-50 p-6 rounded-2xl">
                <h3 className="font-semibold text-blue-800 mb-3">💡 Dicas de precificação:</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Pesquise preços da concorrência antes de definir</li>
                  <li>• Considere seus custos + margem de lucro desejada</li>
                  <li>• Preços terminados em 9 (ex: R$ 29,90) convertem mais</li>
                  <li>• Use preço original para criar senso de urgência</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">
                Preview do Produto
              </h2>
              <p className="text-gray-600 text-base lg:text-lg">Veja como ficará seu anúncio</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Preview Card - responsive */}
              <Card className="overflow-hidden bg-white shadow-xl order-2 lg:order-1">
                {productData.images[0] && (
                  <Image
                    src={productData.images[0].url || "/placeholder.svg"}
                    alt="Preview"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {selectedCategory && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {selectedCategory.name}
                      </Badge>
                    )}
                    <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {productData.name || "Nome do Produto"}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {productData.description || "Descrição do produto..."}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {productData.origin_price &&
                        Number.parseFloat(productData.origin_price) >
                        Number.parseFloat(productData.price || "0") && (
                          <span className="text-sm text-gray-500 line-through">
                            R$ {Number.parseFloat(productData.origin_price).toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      <span className="text-2xl font-bold text-green-600">
                        R${" "}
                        {productData.price
                          ? Number.parseFloat(productData.price).toFixed(2).replace(".", ",")
                          : "0,00"}
                      </span>
                    </div>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                      Comprar
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Summary - responsive */}
              <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
                <Card className="p-6 bg-white/70 border-white/50">
                  <h3 className="font-semibold text-gray-800 mb-4">Resumo do Produto</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fotos:</span>
                      <span className="font-medium">{productData.images.length} imagens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoria:</span>
                      <span className="font-medium">{selectedCategory?.name || "Não selecionada"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Especificações:</span>
                      <span className="font-medium">{Object.keys(productData.specifications).length} itens</span>
                    </div>
                  </div>
                </Card>

                {Object.keys(productData.specifications).length > 0 && (
                  <Card className="p-6 bg-white/70 border-white/50">
                    <h3 className="font-semibold text-gray-800 mb-4">Especificações</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(productData.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 8 && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Parabéns!</h2>
            <p className="text-xl text-gray-600 mb-8">Seu produto foi criado com sucesso e está pronto para vender</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-white/70 px-8"
                >
                  Ver Todos os Produtos
                </Button>
              </Link>
              <Link href="/novo-produto">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8"
                >
                  Criar Outro Produto
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>

      {currentStep < 8 && (
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-white/70 px-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            onClick={currentStep !== 7 ? nextStep : handleCreateProduct}
            disabled={
              (currentStep === 1 && productData.images.length === 0) ||
              (currentStep === 2 && !productData.category) ||
              (currentStep === 3 && !productData.name) ||
              (currentStep === 4 && !productData.description) ||
              (currentStep === 6 && !productData.price) ||
              loadingRegisterProduct
            }
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8"
          >
            {currentStep === 7 ? "Criar Produto" : "Próximo"}
            {loadingRegisterProduct ? <Loader className="w-4 h-4 ml-2 animate-spin" /> : <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      )}

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} trigger="ai-button" />
    </div>
  )
}
