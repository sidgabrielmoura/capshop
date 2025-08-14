"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    XCircle,
    ArrowLeft,
    RefreshCw,
    CreditCard,
    Clock,
    Shield,
    Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { loadStripe } from "@stripe/stripe-js"
import { useRouter } from "next/navigation"
import { Plan } from "@/interfaces"

const reasons = [
    {
        icon: Clock,
        title: "Tempo Esgotado",
        description: "A sessão de pagamento expirou",
        color: "bg-orange-500",
    },
    {
        icon: CreditCard,
        title: "Problema no Cartão",
        description: "Dados do cartão incorretos ou insuficientes",
        color: "bg-red-500",
    },
    {
        icon: Shield,
        title: "Segurança",
        description: "Transação bloqueada por segurança",
        color: "bg-blue-500",
    },
    {
        icon: XCircle,
        title: "Cancelamento Manual",
        description: "Você cancelou o pagamento",
        color: "bg-gray-500",
    },
]

const alternatives = [
    {
        icon: RefreshCw,
        title: "Tentar Novamente",
        description: "Refazer o pagamento com os mesmos dados",
        action: "Tentar Agora",
        action_id: "try_again",
        color: "from-purple-500 to-blue-500",
    },
    {
        icon: Sparkles,
        title: "Plano Gratuito",
        description: "Continuar com recursos limitados",
        action: "Usar Gratuito",
        action_id: "use_free_plan",
        color: "from-gray-500 to-gray-600",
    },
]

const benefits = [
    "✨ IA ilimitada para títulos e descrições",
    "🚀 Otimização para todas as plataformas",
    "📊 Análises avançadas de performance",
    "🎯 Suporte prioritário 24/7",
    "💡 Templates personalizados",
    "🔄 Histórico completo de gerações",
]

type SelectedPlan = {
  price_id: string;
  name: string;
  price: string;
  period: string;
  price_number: number
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentCancelledPage() {
    const router = useRouter()
    const [selectedReason, setSelectedReason] = useState<string | null>(null)
    const [planData, setPlanData] = useState<Plan | null>(null)

    const handleTryAgain = async (priceID: string) => {
        const planToStore: SelectedPlan = {
            price_id: planData?.price_id as string,
            name: planData?.name as string,
            price: planData?.price as string,
            period: planData?.period as string,
            price_number: planData?.numberPrice as number
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
            localStorage.setItem("selectedPlan", JSON.stringify(planToStore))
        }
    }

    useEffect(() => {
        const storedPlan = localStorage.getItem("selectedPlan")
        if (storedPlan) {
            setPlanData(JSON.parse(storedPlan))
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar ao início
                    </Link>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Main Message */}
                    <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                        {/* Status Card */}
                        <Card className="p-6 sm:p-8 lg:p-12 bg-white/80 backdrop-blur-xl border-white/30 shadow-2xl text-center">
                            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <XCircle className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Pagamento Cancelado</h1>

                            <p className="text-lg lg:text-xl text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
                                Não se preocupe! Seu pagamento não foi processado e nenhum valor foi cobrado.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
                                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 px-4 py-2">
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Transação não realizada
                                </Badge>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-4 py-2">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Dados seguros
                                </Badge>
                            </div>

                            {/* Quick Actions */}
                            <div className="w-full max-w-lg mx-auto">
                                <Button
                                    onClick={() => handleTryAgain(planData?.price_id as string)}
                                    size="lg"
                                    className="cursor-pointer bg-gradient-to-r w-full from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white h-12 lg:h-14 text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                                    Tentar Novamente
                                </Button>
                            </div>
                        </Card>

                        {/* Possible Reasons */}
                        <Card className="p-4 sm:p-6 lg:p-8 bg-white/70 backdrop-blur-sm border-white/30">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Possíveis Motivos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                {reasons.map((reason, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedReason(selectedReason === reason.title ? null : reason.title)}
                                        className={`p-3 lg:p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-[1.02] border-white/40 bg-white/50 hover:border-purple-300 hover:bg-white/70`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-8 h-8 lg:w-10 lg:h-10 ${reason.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                                            >
                                                <reason.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 mb-1 text-sm lg:text-base">{reason.title}</h3>
                                                <p className="text-xs lg:text-sm text-gray-600">{reason.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Alternative Options */}
                        <Card className="p-4 sm:p-6 lg:p-8 bg-white/70 backdrop-blur-sm border-white/30">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">
                                O que você gostaria de fazer?
                            </h2>
                            <div className="space-y-3 lg:space-y-4">
                                {alternatives.map((alt, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 bg-gradient-to-r from-white/60 to-white/40 rounded-2xl border border-white/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] gap-4 sm:gap-0"
                                    >
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <div
                                                className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${alt.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                                            >
                                                <alt.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-base lg:text-lg">{alt.title}</h3>
                                                <p className="text-sm lg:text-base text-gray-600">{alt.description}</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                if (alt.action_id === "try_again") {
                                                    handleTryAgain(planData?.price_id as string)
                                                    return
                                                }

                                                router.push('/')
                                            }}
                                            className={`bg-gradient-to-r ${alt.color} hover:shadow-lg text-white px-4 lg:px-6 py-2 font-semibold text-sm lg:text-base w-full sm:w-auto`}
                                        >
                                            {alt.action}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Mobile Premium Card - Only visible on mobile */}
                        <div className="xl:hidden">
                            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200/50">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Você estava quase lá!</h3>
                                    <p className="text-gray-600">Veja o que você perdeu com o Premium</p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-700">
                                            <span className="mr-3">{benefit.split(" ")[0]}</span>
                                            <span>{benefit.split(" ").slice(1).join(" ")}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-6 bg-purple-200/50" />

                                <div className="text-center">
                                    <div className="mb-4">
                                        <span className="text-3xl font-bold text-purple-600">{planData?.price}</span>
                                        <span className="text-gray-500 ml-2">/{planData?.period}</span>
                                    </div>
                                    <Button onClick={() => handleTryAgain(planData?.price_id as string)} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Tentar Premium Novamente
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column - Benefits & Info - Desktop Only */}
                    <div className="hidden xl:block">
                        <div className="sticky top-8 space-y-6">
                            {/* What You're Missing - Fixed Position */}
                            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200/50">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Você estava quase lá!</h3>
                                    <p className="text-gray-600">Veja o que você perdeu com o Premium</p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-700">
                                            <span className="mr-3">{benefit.split(" ")[0]}</span>
                                            <span>{benefit.split(" ").slice(1).join(" ")}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-6 bg-purple-200/50" />

                                <div className="text-center">
                                    <div className="mb-4">
                                        <span className="text-3xl font-bold text-purple-600">{planData?.price}</span>
                                        <span className="text-gray-500 ml-2">/{planData?.period}</span>
                                    </div>
                                    <Button onClick={() => handleTryAgain(planData?.price_id as string)} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Tentar Premium Novamente
                                    </Button>
                                </div>
                            </Card>

                            {/* Security Info */}
                            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-2">Seus Dados Estão Seguros</h3>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Nenhum valor foi cobrado</li>
                                            <li>• Dados do cartão não foram salvos</li>
                                            <li>• Transação 100% segura</li>
                                            <li>• Criptografia SSL 256-bit</li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/50">
                                <h3 className="font-bold text-gray-800 mb-4">Por que escolher o Premium?</h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-yellow-600">10x</div>
                                        <div className="text-xs text-gray-600">Mais vendas</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-orange-600">5min</div>
                                        <div className="text-xs text-gray-600">Para criar anúncio</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-red-600">95%</div>
                                        <div className="text-xs text-gray-600">Satisfação</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-600">24/7</div>
                                        <div className="text-xs text-gray-600">Suporte</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <Card className="mt-8 lg:mt-12 p-6 lg:p-8 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 backdrop-blur-xl border-white/30 text-center">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                        Não desista do seu sucesso! 🚀
                    </h2>
                    <p className="text-base lg:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                        Milhares de vendedores já aumentaram suas vendas com nossa IA. Que tal tentar novamente com um método de
                        pagamento diferente?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <Button
                            onClick={() => handleTryAgain(planData?.price_id as string)}
                            size="lg"
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                            Tentar Outro Cartão
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
