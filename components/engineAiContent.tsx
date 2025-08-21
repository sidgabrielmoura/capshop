"use client"

import { useEffect, useState } from "react"
import { Sparkles, Save, Instagram, ShoppingBag, Smartphone, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PricingModal } from "@/components/pricingModal"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const niches = [
  { value: "moda", label: "Moda e Vestuário", icon: "👗" },
  { value: "eletronicos", label: "Eletrônicos", icon: "📱" },
  { value: "casa", label: "Casa e Decoração", icon: "🏠" },
  { value: "beleza", label: "Beleza e Cuidados", icon: "💄" },
  { value: "esportes", label: "Esportes e Fitness", icon: "⚽" },
  { value: "livros", label: "Livros e Educação", icon: "📚" },
]

const tones = [
  { value: "profissional", label: "Profissional", description: "Tom formal e técnico" },
  { value: "casual", label: "Casual", description: "Tom descontraído e amigável" },
  { value: "persuasivo", label: "Persuasivo", description: "Focado em vendas" },
  { value: "informativo", label: "Informativo", description: "Educativo e detalhado" },
]

const platforms = [
  { name: "Instagram", icon: Instagram, color: "bg-pink-500" },
  { name: "Mercado Livre", icon: ShoppingBag, color: "bg-yellow-500" },
  { name: "OLX", icon: Smartphone, color: "bg-purple-500" },
  { name: "Shopee", icon: Zap, color: "bg-orange-500" },
]

export default function AIConfigPage() {
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const route = useRouter()
  const [config, setConfig] = useState({
    niche: "",
    tone: "",
    customInstructions: "",
    storeName: "",
  })
  const user = useSession().data?.user

  const handleSave = () => {
    // Simular salvamento
    alert("Configurações salvas com sucesso!")
  }

  useEffect(() => {
    route.push("/")
  }, [route])

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Configuração da IA</h1>
        <p className="text-gray-600">Personalize a IA para gerar conteúdo otimizado para seu negócio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 w-full">
          {/* Nicho da Loja */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/30">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              Nicho da Sua Loja
            </h2>
            <p className="text-gray-600 mb-4">Selecione o nicho principal dos seus produtos</p>

            <div className="grid grid-cols-2 gap-3">
              {niches.map((niche) => (
                <button
                  key={niche.value}
                  onClick={() => setConfig((prev) => ({ ...prev, niche: niche.value }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${config.niche === niche.value
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-25"
                    }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{niche.icon}</span>
                    <span className="font-medium text-gray-800">{niche.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Tom de Voz */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/30">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tom de Voz</h2>
            <p className="text-gray-600 mb-4">Como a IA deve escrever seus títulos e descrições</p>

            <div className="space-y-3">
              {tones.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setConfig((prev) => ({ ...prev, tone: tone.value }))}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${config.tone === tone.value
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">{tone.label}</h3>
                      <p className="text-sm text-gray-600">{tone.description}</p>
                    </div>
                    {config.tone === tone.value && <div className="w-4 h-4 bg-purple-500 rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Informações da Loja */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/30">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações da Loja</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Loja</label>
                <Input
                  placeholder="Ex: Minha Loja Incrível"
                  value={config.storeName}
                  onChange={(e) => setConfig((prev) => ({ ...prev, storeName: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instruções Personalizadas</label>
                <Textarea
                  placeholder="Ex: Sempre mencionar frete grátis, destacar qualidade premium..."
                  value={config.customInstructions}
                  onChange={(e) => setConfig((prev) => ({ ...prev, customInstructions: e.target.value }))}
                  className="min-h-24"
                />
              </div>
            </div>
          </Card>

          <Button
            onClick={handleSave}
            className="w-full h-12 cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Como a IA Ajuda */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Como a IA Ajuda</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">Gera títulos otimizados para SEO</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">Cria descrições persuasivas</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">Adapta conteúdo para cada plataforma</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-700">Aumenta taxa de conversão</p>
              </div>
            </div>
          </Card>

          {/* Plataformas Suportadas */}
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/30">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Plataformas Suportadas</h3>
            <div className="space-y-3">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center">
                  <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center mr-3`}>
                    <platform.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Otimizado
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Upgrade Premium */}
          {user?.subscription?.plan.name !== "Pro" ? (
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium</h3>
                <p className="text-sm text-gray-600 mb-4">Desbloqueie todo o potencial da IA</p>
                <Button onClick={() => setIsPricingOpen(true)} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                  Fazer Upgrade
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Você é Premium</h3>
                <p className="text-sm text-gray-600 mb-4">Aproveite todo o potencial da IA</p>
              </div>
            </Card>
          )}
        </div>
        <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} trigger="config" />
      </div>
    </div>
  )
}
