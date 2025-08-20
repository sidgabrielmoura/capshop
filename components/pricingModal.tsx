"use client"

import { useState } from "react"
import { Check, Sparkles, X, Zap, Crown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { loadStripe } from "@stripe/stripe-js"
import { Plan } from "@/interfaces"
import { CoinsModal } from "./coinsModal"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?: "ai-button" | "sidebar" | "config"
}

type SelectedPlan = {
  price_id: string;
  name: string;
  price: string;
  period: string;
  price_number: number
};

const plans = [
  {
    id: "coins",
    price_id: "price_1Rvt5fQCuTgWpGfkA4UlPm2w",
    name: "Adicionar capcoins",
    description: "Adicione capcoins à sua conta",
    price: "Livre",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    features: ["geração de título", "geração de descrição", "Otimização para 2 plataformas", "Suporte básico"],
    limitations: [],
    popular: false,
    buttonText: "Comprar Agora",
  },
  {
    id: "monthly",
    price_id: "price_1RvsnuQCuTgWpGfkmAzW0Unn",
    name: "Premium Mensal",
    description: "Para vendedores ativos",
    price: "R$ 29,90",
    numberPrice: 29.90,
    period: "por mês",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    features: [
      "Gerações ilimitadas",
      "Todos os tipos de conteúdo",
      "Otimização para todas as plataformas",
      "Personalização avançada de tom",
      "Histórico completo",
      "Suporte prioritário",
      "Análise de performance",
      "Templates personalizados",
    ],
    limitations: [],
    popular: true,
    buttonText: "Começar Agora",
  },
  {
    id: "yearly",
    price_id: "price_1Rvt6YQCuTgWpGfkTIYNBOTZ",
    name: "Premium Anual",
    description: "Melhor custo-benefício",
    price: "R$ 299,90",
    numberPrice: 299.90,
    period: "por ano",
    originalPrice: "R$ 358,80",
    discount: "17% OFF",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    features: [
      "Tudo do plano mensal",
      "2 meses grátis",
      "Acesso antecipado a novos recursos",
      "Consultoria personalizada",
      "API para integrações",
      "Relatórios avançados",
      "Backup automático",
    ],
    limitations: [],
    popular: false,
    buttonText: "Economizar 17%",
  },
]

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function PricingModal({ isOpen, onClose, trigger = "ai-button" }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isCoinsModalOpen, setIsCoinsModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async (planId: string, plan: Plan, id: string) => {
    setSelectedPlan(planId)
    setIsProcessing(true)

    if(id === "coins"){
      setIsCoinsModalOpen(true)
      setIsProcessing(false)
      setSelectedPlan(null)
      onClose()
      return
    }

    await HandleBuyPlan(planId, plan).then(() => {
      setIsProcessing(false)
      setSelectedPlan(null)
    })

    onClose()
  }

  const getTriggerMessage = () => {
    switch (trigger) {
      case "ai-button":
        return "Para usar a IA, você precisa de um plano premium"
      case "sidebar":
        return "Desbloqueie todo o potencial da IA"
      case "config":
        return "Acesse configurações avançadas da IA"
      default:
        return "Escolha o plano ideal para você"
    }
  }

  const HandleBuyPlan = async (priceID: string, plan: Plan) => {
    setIsProcessing(true)

    const planToStore: SelectedPlan = {
      price_id: plan.price_id,
      name: plan.name,
      price: plan.price,
      period: plan.period || "",
      price_number: plan.numberPrice || 0
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ priceID }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    await stripePromise;
    if (data) {
      window.location.href = data.url
      setIsProcessing(false)
      localStorage.setItem("selectedPlan", JSON.stringify(planToStore))
    }

  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-pink-50/70 via-purple-50/70 to-blue-50/70 border-white/20 backdrop-blur-xs">
          <DialogHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Upgrade para Premium
            </DialogTitle>

            <p className="text-gray-600 text-lg mt-2 text-center">{getTriggerMessage()}</p>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <Check className="w-3 h-3 mr-1" />
                Sem compromisso
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Sparkles className="w-3 h-3 mr-1" />
                Cancele quando quiser
              </Badge>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 w-full">
            {plans.map((plan) => (
              <div key={plan.id} className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between ${plan.popular
                ? "border-purple-300 bg-white/80 shadow-xl scale-105"
                : "border-white/30 bg-white/60 hover:bg-white/70 hover:border-purple-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}

                {plan.discount && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1">
                      {plan.discount}
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className="text-sm text-gray-500 line-through mb-1">{plan.originalPrice}</div>
                    )}
                    <div className="text-3xl font-bold text-gray-800">
                      {plan.price}
                      <span className="text-sm font-normal text-gray-600 ml-1">{plan.period}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}

                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <X className="w-4 h-4 text-red-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePurchase(plan.price_id, plan, plan.id)}
                  disabled={isProcessing}
                  className={`w-full ${plan.popular
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                    } text-white font-medium py-3 cursor-pointer`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processando...
                    </div>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </div>
            ))}
          </div>

          <Separator className="my-6 bg-white/30" />

          <div className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Pagamento seguro
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Suporte 24/7
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Garantia de 7 dias
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Ao continuar, você concorda com nossos{" "}
              <button className="text-purple-600 hover:underline">Termos de Serviço</button> e{" "}
              <button className="text-purple-600 hover:underline">Política de Privacidade</button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <CoinsModal isOpen={isCoinsModalOpen} setIsOpen={() => setIsCoinsModalOpen(false)} />
    </>
  )
}
