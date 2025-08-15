"use client"

import { useState } from "react"
import { Coins, Plus, Sparkles, Check, Zap, Star, Crown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { loadStripe } from "@stripe/stripe-js"

interface CoinsModalProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

const coinPackages = [
    {
        id: "starter",
        coins: 5,
        price: 10,
        product_id: "price_1Rw8nEQCuTgWpGfknSwWOh33",
        originalPrice: null,
        popular: false,
        badge: null,
        color: "from-blue-500 to-cyan-500",
        icon: Zap,
        title: "Starter",
        description: "Ideal para testar",
        features: ["5 gerações de IA", "Títulos e descrições", "Suporte básico"],
    },
    {
        id: "popular",
        coins: 15,
        price: 30,
        product_id: "price_1Rw8nEQCuTgWpGfknSwWOh33",
        originalPrice: 30,
        popular: true,
        badge: "Mais Popular",
        color: "from-purple-500 to-pink-500",
        icon: Star,
        title: "Popular",
        description: "Melhor custo-benefício",
        features: ["15 gerações de IA", "Todos os recursos", "Suporte prioritário", "5 coins grátis"],
    },
    {
        id: "pro",
        coins: 30,
        price: 60,
        product_id: "price_1Rw8nEQCuTgWpGfknSwWOh33",
        originalPrice: 60,
        popular: false,
        badge: "25% OFF",
        color: "from-yellow-500 to-orange-500",
        icon: Crown,
        title: "Pro",
        description: "Para uso intensivo",
        features: ["30 gerações de IA", "Recursos premium", "Suporte VIP", "15 coins grátis"],
    },
]

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CoinsModal({ isOpen, setIsOpen }: CoinsModalProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
    const productID = "price_1Rw8nEQCuTgWpGfknSwWOh33"
    const [isProcessing, setIsProcessing] = useState(false)
    const [showCustom, setShowCustom] = useState(false)
    const [customAmount, setCustomAmount] = useState("")

    const customCoins = customAmount ? Math.floor(Number(customAmount) / 2) : 0

    const handleBuyPlan = async (id: string, quantity: number) => {
        setIsProcessing(true)
        const payload = {
            id,
            quantity,
            price: (quantity * 2).toFixed(2),
        }

        const res = await fetch("/api/checkout", {
            method: "POST",
            body: JSON.stringify({ priceID: id, quantity }),
            headers: { "Content-Type": "application/json" },
        });

        setIsProcessing(false)
        const data = await res.json();
        await stripePromise;
        if (data) {
            window.location.href = data.url
            localStorage.setItem("coins-payment", JSON.stringify(payload))
        }

    }

    const handleCustomPurchase = async (id: string) => {
        const amount = Number(customAmount);
        if (!amount || amount < 2 || amount % 2 !== 0) return;

        await handleBuyPlan(id, customCoins);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-yellow-50/70 backdrop-blur-lg border-orange-200/50">
                <DialogHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Coins className="w-10 h-10 text-white" />
                    </div>

                    <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent text-center">
                        Comprar Capcoins
                    </DialogTitle>

                    <p className="text-gray-600 text-lg mt-2 text-center">Use capcoins para gerar conteúdo com IA quando precisar</p>

                    <div className="flex items-center justify-center gap-2 mt-4">
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 px-4 py-2">
                            <Coins className="w-3 h-3 mr-1" />5 capcoins = 1 geração
                        </Badge>
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 px-4 py-2">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Capcoins não expiram
                        </Badge>
                    </div>
                </DialogHeader>

                {/* Pacotes Pré-definidos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {coinPackages.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className={`relative p-6 transition-all duration-300 hover:scale-105 cursor-pointer ${pkg.popular
                                ? "border-2 border-purple-300 bg-white/90 shadow-xl"
                                : "border border-orange-200/50 bg-white/70 hover:bg-white/80"
                                }`}
                            onClick={() => handleBuyPlan(pkg.product_id, pkg.coins)}
                        >
                            {pkg.badge && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge
                                        className={`${pkg.popular
                                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                            : "bg-gradient-to-r from-yellow-500 to-orange-500"
                                            } text-white px-4 py-1`}
                                    >
                                        {pkg.badge}
                                    </Badge>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <div
                                    className={`w-16 h-16 bg-gradient-to-r ${pkg.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                >
                                    <pkg.icon className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                                <div className="mb-4">
                                    <div className="text-4xl font-bold text-yellow-600 mb-1">
                                        {pkg.coins}
                                        <span className="text-lg text-gray-600 ml-1">capcoins</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        {pkg.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                R$ {pkg.originalPrice.toFixed(2).replace(".", ",")}
                                            </span>
                                        )}
                                        <span className="text-2xl font-bold text-gray-800">
                                            R$ {pkg.price.toFixed(2).replace(".", ",")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                {pkg.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-sm">
                                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                disabled={isProcessing && selectedPackage === pkg.id}
                                className={`w-full bg-gradient-to-r ${pkg.color} hover:shadow-lg text-white font-semibold py-3 transition-all duration-200 cursor-pointer`}
                            >
                                {isProcessing && selectedPackage === pkg.id ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Processando...
                                    </div>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Comprar Agora
                                    </>
                                )}
                            </Button>
                        </Card>
                    ))}
                </div>

                {/* Opção Personalizada */}
                <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Valor Personalizado</h3>
                            <p className="text-sm text-gray-600">Escolha a quantidade exata que precisa</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowCustom(!showCustom)} className="border-gray-300">
                            {showCustom ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </Button>
                    </div>

                    {showCustom && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor em Reais (mín. R$ 2,00)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                                        <input
                                            type="number"
                                            placeholder="0,00"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                                            min="2"
                                            step="2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Capcoins que você receberá</label>
                                    <div className="flex items-center h-12 px-4 bg-orange-100 border border-orange-200 rounded-xl">
                                        <Coins className="w-5 h-5 text-orange-600 mr-2" />
                                        <span className="text-lg font-bold text-orange-600">
                                            {customCoins} {customCoins === 1 ? "capcoin" : "capcoins"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => handleCustomPurchase(productID)}
                                disabled={!customAmount || Number(customAmount) < 2 || (isProcessing && selectedPackage === "custom")}
                                className="w-full bg-gradient-to-r from-sky-500 to-purple-700 cursor-pointer hover:opacity-95 hover:shadow-lg transition-all duration-200 text-white font-semibold py-3"
                            >
                                {isProcessing && selectedPackage === "custom" ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Processando...
                                    </div>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Comprar {customCoins} {customCoins === 1 ? "capcoin" : "capcoins"}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Informações Importantes */}
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 mt-6">
                    <h4 className="font-semibold text-blue-800 mb-3">💡 Como funcionam os capcoins:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                        <div>
                            <p className="font-medium mb-2">Uso dos coins:</p>
                            <ul className="space-y-1">
                                <li>• 5 capcoins = 1 título gerado</li>
                                <li>• 5 capcoins = 1 descrição gerada</li>
                                <li>• Use quando precisar</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-medium mb-2">Vantagens:</p>
                            <ul className="space-y-1">
                                <li>• Capcoins nunca expiram</li>
                                <li>• Pague apenas pelo que usar</li>
                                <li>• Sem mensalidade</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
