"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Upload, Sparkles, Check, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PricingModal } from "@/components/pricingModal"
import Link from "next/link"
import Image from "next/image"

const steps = [
  { id: 1, name: "Fotos", description: "Upload das imagens" },
  { id: 2, name: "Nome", description: "Título do produto" },
  { id: 3, name: "Descrição", description: "Detalhes do produto" },
  { id: 4, name: "Preço", description: "Valor do produto" },
  { id: 5, name: "Preview", description: "Visualização final" },
  { id: 6, name: "Sucesso", description: "Produto criado" },
]

export default function NewProductPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [productData, setProductData] = useState({
    images: [] as string[],
    name: "",
    description: "",
    price: "",
    originalPrice: "",
  })

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

    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 10), // limita a 10 imagens
    }))
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateWithAI = (field: "name" | "description") => {
    // Simular verificação de premium - abrir modal
    setIsPricingOpen(true)
  }

  const createNewProduct = () => {
    setProductData({ images: [], name: '', description: '', price: '', originalPrice: '' })
    setCurrentStep(1)
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos produtos
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Criar Novo Produto</h1>
        <p className="text-gray-600">Siga os passos para criar seu produto</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 border-transparent text-white"
                  : "border-gray-300 text-gray-500"
                  }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${currentStep > step.id ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-300"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <div key={step.id} className="text-center">
              <p className="text-sm font-medium text-gray-800">{step.name}</p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/30">
        {currentStep === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload das Fotos</h2>
            <p className="text-gray-600 mb-6">Adicione até 10 fotos do seu produto</p>

            <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 mb-6 hover:border-purple-400 transition-colors">
              <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-800 mb-2">Arraste suas fotos aqui</p>
              <p className="text-gray-600 mb-4">ou clique para selecionar</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-xl cursor-pointer">
                Selecionar Fotos
              </label>
            </div>

            {productData.images.length > 0 && (
              <div className="grid grid-cols-5 gap-4 mb-6">
                {productData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Produto ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full object-cover rounded-lg"
                    />
                    <Badge onClick={() => {
                      const newImages = productData.images.filter((_, i) => i !== index)
                      setProductData({ images: newImages, name: '', description: '', price: '', originalPrice: '' })
                    }} className="absolute py-2 cursor-pointer -top-2 -right-2 bg-purple-500"><X /></Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nome do Produto</h2>
            <p className="text-gray-600 mb-6">Dê um nome atrativo para seu produto</p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o nome do produto..."
                  value={productData.name}
                  onChange={(e) => setProductData((prev) => ({ ...prev, name: e.target.value }))}
                  className="flex-1"
                />
                <Button
                  onClick={() => generateWithAI("name")}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar com IA
                </Button>
              </div>

              {productData.name && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700 mb-1">Preview:</p>
                  <p className="font-medium text-gray-800">{productData.name}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Descrição do Produto</h2>
            <p className="text-gray-600 mb-6">Descreva os detalhes e benefícios do seu produto</p>

            <div className="space-y-4">
              <div className="flex gap-2 items-start">
                <Textarea
                  placeholder="Digite a descrição do produto..."
                  value={productData.description}
                  onChange={(e) => setProductData((prev) => ({ ...prev, description: e.target.value }))}
                  className="flex-1 min-h-32"
                />
                <Button
                  onClick={() => generateWithAI("description")}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar com IA
                </Button>
              </div>

              {productData.description && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700 mb-1">Preview:</p>
                  <p className="text-gray-800">{productData.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Preço do Produto</h2>
            <p className="text-gray-600 mb-6">Defina o valor de venda do seu produto</p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço de Venda *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={productData.price}
                      onChange={(e) => setProductData((prev) => ({ ...prev, price: e.target.value }))}
                      className="pl-10"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço Original (opcional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={productData.originalPrice}
                      onChange={(e) => setProductData((prev) => ({ ...prev, originalPrice: e.target.value }))}
                      className="pl-10"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Para mostrar desconto</p>
                </div>
              </div>

              {productData.price && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700 mb-2">Preview do preço:</p>
                  <div className="flex items-center gap-2">
                    {productData.originalPrice && parseFloat(productData.originalPrice) > parseFloat(productData.price) && (
                      <span className="text-lg text-gray-500 line-through">
                        R$ {parseFloat(productData.originalPrice).toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-green-600">
                      R$ {parseFloat(productData.price).toFixed(2).replace('.', ',')}
                    </span>
                    {productData.originalPrice && parseFloat(productData.originalPrice) > parseFloat(productData.price) && (
                      <Badge className="bg-red-100 text-red-700">
                        {Math.round(((parseFloat(productData.originalPrice) - parseFloat(productData.price)) / parseFloat(productData.originalPrice)) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">💡 Dicas de precificação:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Pesquise preços da concorrência</li>
                  <li>• Considere seus custos + margem de lucro</li>
                  <li>• Preços terminados em 9 (ex: R$ 29,90) convertem mais</li>
                  <li>• Use preço original para criar senso de urgência</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Preview do Anúncio</h2>
            <p className="text-gray-600 mb-6">Veja como seu produto ficará nos marketplaces</p>

            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              {productData.images[0] && (
                <Image
                  src={productData.images[0] || "/placeholder.svg"}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{productData.name || "Nome do Produto"}</h3>
                <p className="text-gray-600 mb-4">{productData.description || "Descrição do produto..."}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <span className="text-md text-muted-foreground line-through">R$ {productData.originalPrice}</span>
                      {productData.originalPrice && parseFloat(productData.originalPrice) > parseFloat(productData.price) && (
                        <Badge className="bg-red-100 text-red-700">
                          {Math.round(((parseFloat(productData.originalPrice) - parseFloat(productData.price)) / parseFloat(productData.originalPrice)) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                    <span className="text-2xl font-bold text-green-600">R$ {productData.price}</span>
                  </div>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    Comprar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Parabéns!</h2>
            <p className="text-xl text-gray-600 mb-8">Seu produto foi criado com sucesso</p>

            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                >
                  Ver Todos os Produtos
                </Button>
              </Link>
              <Button onClick={createNewProduct} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                Criar Outro Produto
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      {currentStep < 6 && (
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <Button
            onClick={nextStep}
            disabled={
              (currentStep === 1 && productData.images.length === 0) ||
              (currentStep === 2 && !productData.name) ||
              (currentStep === 3 && !productData.description)
            }
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            {currentStep === 4 ? "Criar Produto" : "Próximo"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} trigger="ai-button" />
    </div>
  )
}
