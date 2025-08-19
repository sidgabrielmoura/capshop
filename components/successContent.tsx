"use client"
import Link from "next/link"
import {
    CheckCircle,
    ArrowRight,
    Sparkles,
    Crown,
    Gift,
    Zap,
    Star,
    Play,
    BookOpen,
    MessageCircle,
    Calendar,
    CreditCard,
    Coins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { createNotification } from "@/actions"

const planFeatures = [
    {
        icon: Sparkles,
        title: "IA Ilimitada",
        description: "Gere títulos e descrições sem limites",
        color: "bg-purple-500",
    },
    {
        icon: Zap,
        title: "Otimização Automática",
        description: "Para todas as plataformas de venda",
        color: "bg-orange-500",
    },
    {
        icon: Star,
        title: "Suporte Prioritário",
        description: "Atendimento 24/7 exclusivo",
        color: "bg-yellow-500",
    },
    {
        icon: Crown,
        title: "Recursos Premium",
        description: "Acesso a todas as funcionalidades",
        color: "bg-pink-500",
    },
]

const coinsFeatures = [
    {
        icon: Sparkles,
        title: "IA limitada",
        description: "Gere títulos e descrições por coins",
        color: "bg-green-500",
    },
    {
        icon: Zap,
        title: "Otimização Automática",
        description: "Para duas plataformas de venda",
        color: "bg-orange-500",
    },
    {
        icon: Star,
        title: "Suporte Básico",
        description: "Atendimento 24/7",
        color: "bg-blue-500",
    },
    {
        icon: Crown,
        title: "Recursos Premium",
        description: "Acesso a todas as funcionalidades por coins",
        color: "bg-pink-500",
    },
]

const nextSteps = [
    {
        icon: Play,
        title: "Comece Agora",
        description: "Crie seu primeiro produto com IA",
        action: "Criar Produto",
        href: "/registerProduct",
        color: "from-purple-500 to-blue-500",
    },
    {
        icon: BookOpen,
        title: "Configurar IA",
        description: "Personalize a IA para seu negócio",
        action: "Configurar",
        href: "/configuracao-ia",
        color: "from-orange-500 to-yellow-500",
    },
    {
        icon: MessageCircle,
        title: "Suporte Premium",
        description: "Fale com nossa equipe especializada",
        action: "Abrir Chat",
        href: "/suporte",
        color: "from-green-500 to-emerald-500",
    },
]

const benefits = [
    "✨ Gerações ilimitadas de conteúdo",
    "🚀 Otimização para 10+ plataformas",
    "📊 Analytics avançados de performance",
    "🎯 Templates personalizados",
    "💡 Sugestões inteligentes de preços",
    "🔄 Histórico completo de alterações",
    "📱 App mobile em breve",
    "🎨 Temas personalizados",
]

interface Plan {
    price: string,
    period: string,
    price_id: string,
    name: string,
    price_number: number
}

interface Coins {
    id: string,
    quantity: number,
    price: string
}

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const route = useRouter();
    const idParam = searchParams.get("id");

    const [planData, setPlanData] = useState<Plan | null>(null);
    const [coinsData, setCoinsData] = useState<Coins | null>(null);
    const [isCoin, setIsCoin] = useState(false);
    const { data: user, update } = useSession();
    const [hasSubscribed, setHasSubscribed] = useState(false);

    useEffect(() => {
        const storedPlan = localStorage.getItem("selectedPlan");
        const storedCoins = localStorage.getItem("coins-payment");

        if (storedPlan) setPlanData(JSON.parse(storedPlan));
        if (storedCoins) setCoinsData(JSON.parse(storedCoins));

        if (!storedPlan && !storedCoins) {
            route.push("/");
        }

        if (idParam === "coin") setIsCoin(true);
    }, [idParam, route]);

    useEffect(() => {
        if (!planData || !user?.user || hasSubscribed || isCoin) return;

        const handleCreatePlan = async () => {
            try {
                const response = await fetch("/api/subscribe-plan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Pro",
                        price: Number(planData.price_number.toFixed(2)),
                        userId: user.user.id
                    })
                });

                if (!response.ok) {
                    toast.error("Erro ao criar plano. Tente novamente mais tarde.");
                    return;
                }

                await response.json();
                await update();
                toast.success("Plano criado com sucesso!");
                setHasSubscribed(true);
                createNotification({
                    userId: user.user.id || "",
                    title: "Plano Criado",
                    message: `Você criou o plano ${planData.name}.`,
                    type: "CREATE_PLAN"
                })
                localStorage.removeItem("selectedPlan");
                localStorage.removeItem("coins-payment")
            } catch (error) {
                console.log(error);
            } finally {
                localStorage.removeItem("selectedPlan");
                localStorage.removeItem("coins-payment");
            }
        };

        handleCreatePlan();
    }, [planData, user, hasSubscribed, update, isCoin]);

    useEffect(() => {
        if (!coinsData || !user?.user || hasSubscribed || !isCoin) return;

        const handleUpsertCoins = async () => {
            try {
                const response = await fetch("/api/coins", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.user.id,
                        amountToAdd: coinsData?.quantity || 0
                    })
                });

                if (response.ok) {
                    toast.success("Capcoins adicionados com sucesso!")
                    setHasSubscribed(true)
                    createNotification({
                        userId: user.user.id,
                        title: "Capcoins Adicionados",
                        message: `Você recebeu ${coinsData?.quantity} capcoins.`,
                        type: "BUY_COINS"
                    })
                } else {
                    toast.error("Erro ao adicionar capcoins.")
                }

                await update();
                localStorage.removeItem("selectedPlan");
                localStorage.removeItem("coins-payment")
            } catch (error) {
                console.error("Erro ao atualizar coins:", error);
                toast.error("Erro ao atualizar coins.");
            } finally {
                localStorage.removeItem("selectedPlan");
                localStorage.removeItem("coins-payment");
            }
        };

        handleUpsertCoins();
    }, [coinsData, user, hasSubscribed, update, isCoin]);


    return (
        <div className="min-h-screen p-2 lg:p-8">
            <div className="max-w-6xl mx-auto animate-fade-in">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                        {/* Success Card */}
                        <Card className="p-6 sm:p-8 lg:p-12 bg-white shadow-lg text-center bg-gradient-to-br from-green-600/30 to-emerald-500/20">
                            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Pagamento Aprovado!</h1>

                            {isCoin ? (
                                <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                                    Seus Capcoins foram adicionados com sucesso. Agora você pode usá-los para comprar produtos e serviços na plataforma.
                                </p>
                            ) : (
                                <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                                    Sua conta Premium foi ativada com sucesso. Agora você tem acesso a todos os recursos avançados da
                                    plataforma.
                                </p>
                            )}

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-4 py-2">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Pagamento Confirmado
                                </Badge>
                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 px-4 py-2">
                                    {isCoin ? (
                                        <>
                                            <Coins className="w-4 h-4 mr-2" />
                                            <h1>Capcoins adicionados</h1>
                                        </>
                                    ) : (
                                        <>
                                            <Crown className="w-4 h-4 mr-2" />
                                            <h1>Premium Ativo</h1>
                                        </>
                                    )}
                                </Badge>
                            </div>

                            {/* Quick Start Button */}
                            <Link href="/registerProduct">
                                <Button
                                    size="lg"
                                    className="cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white h-12 lg:h-14 text-base lg:text-lg font-semibold px-8 lg:px-12"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Começar a Usar
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </Card>

                        {/* Plan Details */}
                        <Card className="p-6 lg:p-8 bg-white/60 shadow-lg">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Detalhes da compra</h2>
                                    <p className="text-gray-600">{!isCoin ? "Plano Premium Mensal" : "Capcoins Adicionados"}</p>
                                </div>
                                {!isCoin ? (
                                    <div className="text-right">
                                        <div className="text-2xl lg:text-3xl font-bold text-purple-600 truncate">{planData?.price}</div>
                                        <div className="text-sm text-gray-500">{planData?.period}</div>
                                    </div>
                                ) : (
                                    <div className="text-right">
                                        <div className="text-2xl lg:text-3xl font-bold text-purple-600 truncate">R$ {coinsData?.price}</div>
                                        <div className="text-sm text-gray-500">{coinsData?.quantity} coins</div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {isCoin ? (
                                    <>
                                        {coinsFeatures.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className={`min-w-10 min-h-10 ${feature.color} rounded-lg flex items-center justify-center`}>
                                                    <feature.icon className="min-w-5 min-h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{feature.title}</h3>
                                                    <p className="text-xs lg:text-sm text-gray-600">{feature.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {planFeatures.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className={`min-w-10 min-h-10 ${feature.color} rounded-lg flex items-center justify-center`}>
                                                    <feature.icon className="min-w-5 min-h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{feature.title}</h3>
                                                    <p className="text-xs lg:text-sm text-gray-600">{feature.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            {!isCoin && (
                                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm lg:text-base text-gray-700">
                                            <strong>Próxima cobrança:</strong>{" "}
                                            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                                    >
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Gerenciar
                                    </Button>
                                </div>
                            )}
                        </Card>

                        {/* Next Steps */}
                        <Card className="p-6 lg:p-8 bg-gradient-to-tr from-amber-200/20 to-amber-400/20 shadow-lg">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Próximos Passos</h2>
                            <div className="space-y-4">
                                {!isCoin ? (
                                    <>
                                        {nextSteps.map((step, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 gap-4 sm:gap-0"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div
                                                            className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center`}
                                                        >
                                                            <step.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center">
                                                            <span className="text-xs font-bold">{index + 1}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 text-base lg:text-lg">{step.title}</h3>
                                                        <p className="text-sm lg:text-base text-gray-600">{step.description}</p>
                                                    </div>
                                                </div>
                                                <Link href={step.href}>
                                                    <Button
                                                        className={`bg-gradient-to-r ${step.color} hover:shadow-md cursor-pointer text-white px-4 lg:px-6 py-2 font-medium text-sm lg:text-base w-full sm:w-auto`}
                                                    >
                                                        {step.action}
                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 gap-4 sm:gap-0"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div
                                                        className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl flex items-center justify-center`}
                                                    >
                                                        <Play className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-bold">1</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-base lg:text-lg">Use Seus Créditos</h3>
                                                    <p className="text-sm lg:text-base text-gray-600">Crie um produto e use a IA para gerar conteúdo</p>
                                                </div>
                                            </div>
                                            <Link href={"/"}>
                                                <Button
                                                    className={`bg-gradient-to-r from-sky-400 to-blue-500 hover:shadow-md cursor-pointer text-white px-4 lg:px-6 py-2 font-medium text-sm lg:text-base w-full sm:w-auto`}
                                                >
                                                    Usar Agora
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>

                        {/* Mobile Benefits Card */}
                        <div className="xl:hidden">
                            <Card className="p-6 bg-white/60 shadow-lg">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Gift className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{isCoin ? "Seus Créditos" : "Recursos Premium"}</h3>
                                    <p className="text-gray-600">Tudo que você pode fazer agora</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                                            <span className="mr-3">{benefit.split(" ")[0]}</span>
                                            <span>{benefit.split(" ").slice(1).join(" ")}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column - Benefits & Resources - Desktop Only */}
                    <div className="hidden xl:block">
                        <div className="sticky top-8 space-y-6">
                            {/* Benefits Card */}
                            <Card className="p-6 bg-white/60 shadow-lg">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Gift className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{isCoin ? "Seus Créditos" : "Recursos Premium"}</h3>
                                    <p className="text-gray-600">Tudo que você pode fazer agora</p>
                                </div>

                                <div className="space-y-3">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                                            <span className="mr-3">{benefit.split(" ")[0]}</span>
                                            <span>{benefit.split(" ").slice(1).join(" ")}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Support Card */}
                            <Card className="p-6 bg-white/60 shadow-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Suporte Premium</h3>
                                        <ul className="text-sm text-gray-600 space-y-1 mb-4">
                                            <li>• Atendimento prioritário 24/7</li>
                                            <li>• Chat exclusivo para Premium</li>
                                            <li>• Consultoria personalizada</li>
                                            <li>• Treinamentos exclusivos</li>
                                        </ul>
                                        <Button
                                            size="sm"
                                            className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                                        >
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Falar com Especialista
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Bottom Success Banner */}
                <Card className="mt-8 lg:mt-12 p-6 lg:p-8 bg-white/60 shadow-lg text-center">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {!isCoin ? "Bem-vindo ao Capshop Premium!" : "Seus créditos estão prontos!"} 🚀
                    </h2>
                    <p className="text-base lg:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                        {isCoin ? "Use seu crédito para experimentar o poder da IA na criação de conteúdo para seus produtos."
                            : "Você agora faz parte de uma comunidade exclusiva de vendedores que usam IA para multiplicar seus resultados."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                        <Link href="/registerProduct" className="flex-1">
                            <Button
                                size="lg"
                                className="w-full cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 lg:px-8 py-3 text-base lg:text-lg font-semibold"
                            >
                                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                                Criar Primeiro Produto
                            </Button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 px-6 lg:px-8 py-3 text-base lg:text-lg font-semibold bg-transparent"
                            >
                                Ver Dashboard
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
