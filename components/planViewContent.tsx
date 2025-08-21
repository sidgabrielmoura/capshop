"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Crown,
    CreditCard,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Download,
    Star,
    Zap,
    Shield,
    Clock,
    TrendingUp,
    Settings,
    Gift,
    Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const currentPlan = {
    name: "Premium Mensal",
    price: 29.9,
    status: "active",
    nextBilling: "2024-02-15",
    startDate: "2024-01-15",
    features: [
        "Gerações ilimitadas de IA",
        "Otimização para todas as plataformas",
        "Suporte prioritário 24/7",
        "Análises avançadas",
        "Templates personalizados",
        "Histórico completo",
    ],
}

const usage = {
    aiGenerations: { used: 247, limit: "Ilimitado" },
    products: { used: 18, limit: "Ilimitado" },
    storage: { used: 2.4, limit: 10 }, // GB
}

const paymentHistory = [
    {
        id: "1",
        date: "2024-01-15",
        amount: 29.9,
        status: "paid",
        invoice: "INV-001",
        method: "Cartão •••• 4532",
    },
    {
        id: "2",
        date: "2023-12-15",
        amount: 29.9,
        status: "paid",
        invoice: "INV-002",
        method: "Cartão •••• 4532",
    },
    {
        id: "3",
        date: "2023-11-15",
        amount: 29.9,
        status: "paid",
        invoice: "INV-003",
        method: "Cartão •••• 4532",
    },
]

const availablePlans = [
    {
        id: "monthly",
        name: "Premium Mensal",
        price: 29.9,
        period: "mês",
        current: true,
        popular: false,
    },
    {
        id: "yearly",
        name: "Premium Anual",
        price: 299.9,
        period: "ano",
        originalPrice: 358.8,
        discount: "17% OFF",
        current: false,
        popular: true,
    },
]

export default function SubscriptionComponent() {
    const user = useSession().data?.user
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [autoRenew, setAutoRenew] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const route = useRouter()

    const handleCancelSubscription = async () => {
        setIsProcessing(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsProcessing(false)
        setShowCancelModal(false)
        alert("Assinatura cancelada com sucesso. Você ainda pode usar até 15/02/2024.")
    }

    const handleUpgrade = async (planId: string) => {
        setSelectedPlan(planId)
        setIsProcessing(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsProcessing(false)
        setSelectedPlan(null)
        setShowUpgradeModal(false)
        alert("Plano alterado com sucesso!")
    }

    const nextBillingDate = new Date(user?.subscription?.endsAt || "").toLocaleDateString("pt-BR")

    useEffect(() => {
        if(!user){
            route.push('/')
        }
    }, [route, user])
    return (
        <>
            <div className="max-w-6xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar ao dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciar Assinatura</h1>
                            <p className="text-gray-600">Controle sua assinatura, pagamentos e configurações</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-4 py-2">
                                <Crown className="w-4 h-4 mr-2" />
                                Premium Ativo
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                        {/* Current Plan */}
                        <Card className="p-6 lg:p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200/50">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Crown className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h2 className="text-2xl font-bold text-gray-800">{user?.subscription?.plan.name}</h2>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-3xl font-bold text-purple-600">
                                                    R$ {user?.subscription?.plan.priceCents && (user?.subscription?.plan.priceCents).toFixed(2).replace(".", ",") || "0,00"}
                                                </span>
                                                <span className="text-gray-600">/mês</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 w-full">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Próxima cobrança: {nextBillingDate}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                                >
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Upgrade
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentPlan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-sm text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Usage Stats */}
                        <Card className="p-6 lg:p-8 bg-white/80 backdrop-blur-sm border-white/30">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                                Uso Este Mês
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-purple-500" />
                                            <span className="font-medium text-gray-800">Gerações de IA</span>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {usage.aiGenerations.used} / {usage.aiGenerations.limit}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-purple-100 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full w-full" />
                                        </div>
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">Ilimitado</Badge>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span className="font-medium text-gray-800">Produtos Criados</span>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {usage.products.used} / {usage.products.limit}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-yellow-100 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full w-full" />
                                        </div>
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">Ilimitado</Badge>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-blue-500" />
                                            <span className="font-medium text-gray-800">Armazenamento</span>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {usage.storage.used}GB / {usage.storage.limit}GB
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Progress value={(usage.storage.used / usage.storage.limit) * 100} className="flex-1" />
                                        <Badge variant="secondary" className="text-xs">
                                            {Math.round((usage.storage.used / usage.storage.limit) * 100)}%
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Payment History */}
                        <Card className="p-6 lg:p-8 bg-white/80 backdrop-blur-sm border-white/30">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                                    Histórico de Pagamentos
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Exportar
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {paymentHistory.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 gap-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">
                                                    R$ {payment.amount.toFixed(2).replace(".", ",")}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {new Date(payment.date).toLocaleDateString("pt-BR")} • {payment.method}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Pago</Badge>
                                            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                                                <Download className="w-4 h-4 mr-1" />
                                                Nota Fiscal
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Settings */}
                        <Card className="p-6 lg:p-8 bg-white/80 backdrop-blur-sm border-white/30">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <Settings className="w-5 h-5 mr-2 text-gray-500" />
                                Configurações da Assinatura
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Renovação Automática</h4>
                                        <p className="text-sm text-gray-600">Renove automaticamente sua assinatura</p>
                                    </div>
                                    <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Notificações por Email</h4>
                                        <p className="text-sm text-gray-600">Receba lembretes de cobrança e atualizações</p>
                                    </div>
                                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Método de Pagamento</h4>
                                        <p className="text-sm text-gray-600">Cartão •••• 4532 (Visa)</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Alterar
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/30">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h3>
                            <div className="space-y-3">
                                <Button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white justify-start"
                                >
                                    <TrendingUp className="w-4 h-4 mr-3" />
                                    Upgrade para Anual
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
                                >
                                    <CreditCard className="w-4 h-4 mr-3" />
                                    Alterar Pagamento
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 justify-start bg-transparent"
                                >
                                    <Download className="w-4 h-4 mr-3" />
                                    Baixar Faturas
                                </Button>
                            </div>
                        </Card>

                        {/* Upgrade Suggestion */}
                        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/50">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Gift className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Economize 17%</h3>
                                <p className="text-sm text-gray-600 mb-4">Mude para o plano anual e economize R$ 58,90 por ano</p>
                                <Button
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                                >
                                    Ver Plano Anual
                                </Button>
                            </div>
                        </Card>

                        {/* Support */}
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Suporte Premium</h3>
                                <p className="text-sm text-gray-600 mb-4">Precisa de ajuda? Nossa equipe está aqui para você</p>
                                <Button
                                    variant="outline"
                                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                                >
                                    Falar com Suporte
                                </Button>
                            </div>
                        </Card>

                        {/* Cancel Subscription */}
                        <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/30">
                            <div className="text-center">
                                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Cancelar Assinatura</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Você pode cancelar a qualquer momento. Sem taxas de cancelamento.
                                </p>
                                <Button
                                    onClick={() => setShowCancelModal(true)}
                                    variant="outline"
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    Cancelar Assinatura
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogContent className="max-w-md bg-red-50/90 backdrop-blur-sm">
                    <DialogHeader className="text-center pb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-gray-800 text-center">Cancelar Assinatura?</DialogTitle>
                        <DialogDescription className="text-gray-600 text-lg text-center">
                            Você perderá acesso aos recursos Premium em {nextBillingDate}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="bg-white/60 p-4 rounded-xl border border-red-200/50">
                            <h4 className="font-semibold text-gray-800 mb-2">O que você vai perder:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Gerações ilimitadas de IA</li>
                                <li>• Suporte prioritário 24/7</li>
                                <li>• Análises avançadas</li>
                                <li>• Templates personalizados</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={() => setShowCancelModal(false)}
                                variant="outline"
                                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                                disabled={isProcessing}
                            >
                                Manter Assinatura
                            </Button>
                            <Button
                                onClick={handleCancelSubscription}
                                disabled={isProcessing}
                                className="flex-1 bg-gradient-to-r cursor-pointer from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Cancelando...
                                    </div>
                                ) : (
                                    "Confirmar Cancelamento"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Upgrade Modal */}
            <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogContent className="max-w-4xl w-[95vw] bg-gradient-to-br from-yellow-50/95 via-orange-50/95 to-yellow-50/95 backdrop-blur-xl border-orange-200/50">
                    <DialogHeader className="text-center pb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <DialogTitle className="text-3xl font-bold text-gray-800 text-center">Upgrade seu Plano</DialogTitle>
                        <DialogDescription className="text-gray-600 text-lg text-center">Economize mais com o plano anual</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {availablePlans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`p-6 transition-all duration-300 flex flex-col justify-between ${plan.current
                                    ? "border-2 border-purple-300 bg-white/90"
                                    : plan.popular
                                        ? "border-2 border-orange-300 bg-white/90 scale-105"
                                        : "border border-gray-200 bg-white/70"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-1">
                                            Recomendado
                                        </Badge>
                                    </div>
                                )}

                                {plan.current && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1">
                                            Plano Atual
                                        </Badge>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                                    <div className="mb-4">
                                        {plan.originalPrice && (
                                            <div className="text-sm text-gray-500 line-through mb-1">
                                                R$ {plan.originalPrice.toFixed(2).replace(".", ",")}
                                            </div>
                                        )}
                                        <div className="text-3xl font-bold text-gray-800">
                                            R$ {plan.price.toFixed(2).replace(".", ",")}
                                            <span className="text-sm font-normal text-gray-600 ml-1">/{plan.period}</span>
                                        </div>
                                        {plan.discount && (
                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mt-2">{plan.discount}</Badge>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={plan.current || (isProcessing && selectedPlan === plan.id)}
                                    className={`w-full ${plan.current
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : plan.popular
                                            ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                                            : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                                        }`}
                                >
                                    {plan.current ? (
                                        "Plano Atual"
                                    ) : isProcessing && selectedPlan === plan.id ? (
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Processando...
                                        </div>
                                    ) : (
                                        "Selecionar Plano"
                                    )}
                                </Button>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
