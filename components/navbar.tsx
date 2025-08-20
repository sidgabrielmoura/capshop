"use client"

import { ArrowRight, Coins, Crown, Lightbulb, LogIn, LogOut, Search, Sparkles, User, X, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationSheet } from "./notificationsSheet"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { PricingModal } from "./pricingModal"
import { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import { CoinsModal } from "./coinsModal"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useProducts } from "@/providers/productsProvider"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "./ui/card"

const quickSearchResults = [
  { name: "Ativos", id: "active", icon: <Lightbulb className="size-4" /> },
  { name: "Rascunhos", id: "draft", icon: <X className="size-4" /> },
  { name: "Todos", id: "", icon: <Zap className="size-4" /> },
  { name: "Favoritos", id: "favorites", icon: <Sparkles className="size-4" /> }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [isCoinsModalOpen, setIsCoinsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const { fetchProducts } = useProducts()
  const session = useSession().data
  const router = useRouter()
  const [quickSearch, setQuickSearch] = useState(false)
  const [markedQuickSearch, setMarkedQuickSearch] = useState<string | null>(null)

  const user = {
    ...session?.user,
  }

  const handleLogout = async () => {
    await signOut()
  }

  const handleUpgrade = () => {
    setIsPricingOpen(true)
    setIsOpen(false)
  }

  const handleLogin = async () => {
    await signIn("google")
  }

  const searchProducts = async (quickSearch?: string) => {
    if (quickSearch === 'favorites') {
      return
    }

    setQuickSearch(false)
    setMarkedQuickSearch(quickSearch || "")
    fetchProducts(inputValue, quickSearch)
  }

  useEffect(() => {
    if (inputValue.length === 0) {
      fetchProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])

  return (
    <header className="h-16 glass-effect px-8 flex items-center justify-between">
      <div className="flex-1 mx-8 lg:mx-auto max-w-xl">
        <div className="flex gap-2 relative">
          <Button
            disabled={!inputValue.startsWith('/')}
            variant={"secondary"}
            size={"icon"}
            className="cursor-pointer shadow-md max-md:hidden bg-gradient-to-r from-purple-500/80 text-zinc-50 to-blue-500/80 hover:scale-105 transition-transform duration-200"
            onClick={() => setQuickSearch(!quickSearch)}
          >
            <Zap />
          </Button>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pesquisar produtos. ( / ) para pesquisa rápida"
              className="pl-10 bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200 lg:text-md text-xs"
            />
            {inputValue.length >= 3 && (
              <ArrowRight onClick={() => searchProducts()} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer" />
            )}
          </div>

          <div className="absolute top-10 w-full py-1">
            {quickSearch && inputValue.startsWith('/') && (
              <Card className="py-1">
                <CardContent className="flex items-center gap-1 p-2 overflow-x-auto">
                  {quickSearchResults.map((result) => (
                    <div onClick={() => {
                      searchProducts(result.id)
                    }} key={result.id} className={`flex items-center py-2 px-3 gap-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 ${markedQuickSearch === result.id ? 'bg-gray-100' : ''}`}>
                      {result.icon}
                      <span>{result.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {session && (
          <Button
            onClick={() => setIsCoinsModalOpen(true)}
            size={"sm"}
            className="px-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 max-md:hidden
            hover:from-yellow-500 hover:to-orange-600 cursor-pointer text-zinc-50"
          >
            <span>{user.amount || "0"}</span>
            <Coins />
          </Button>
        )}

        <div className="max-md:hidden">
          <NotificationSheet />
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.image || ''} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm">{user?.name?.split(' ')[0].split('')[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </SheetTrigger>
          <SheetContent className="py-1 px-3 bg-gradient-to-br from-pink-50/95 via-purple-50/95 to-blue-50/95 backdrop-blur-xl border-white/20 glass-effect-clean">
            <SheetHeader className="pb-0 mb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-left text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Minha Conta
                </SheetTitle>
                <SheetClose>
                  <Button variant={'outline'} size={'icon'} className="cursor-pointer">
                    <X />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>

            {/* User Profile Card */}
            {session ? (
              <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4 mb-1 space-y-4">
                {user.subscription?.plan.name === "Pro" ? (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-sm h-8 w-full">
                    <Crown className="size-4 mr-1" />
                    PRO
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-200 h-8 w-full">
                    FREE
                  </Badge>
                )}
                <div className="flex items-center gap-4">
                  <Avatar className="lg:size-14 size-10 ring-2 ring-white/50">
                    <AvatarImage src={user?.image || ''} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-semibold">
                      {user?.name?.split(' ')[0].split('')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex justify-between w-full">
                    <div className="flex justify-between w-full mt-2 relative">
                      <div className="flex flex-col">
                        <h1 className="font-bold text-gray-900 text-md lg:text-lg leading-tight mb-1">{user?.name?.split(' ')[0] + ' ' + user?.name?.split(' ')[1]}</h1>
                        <p className="text-xs lg:text-sm text-gray-600 mb-3">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Faça login
              </Button>
            )}

            {session && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl px-5 py-3">
                <div className="flex items-center">
                  <div className="min-w-8 min-h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <Coins className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <h4 className="font-bold text-yellow-800">{user.amount || 0.00} <span className="max-md:hidden">Capcoins</span></h4>
                    <Button onClick={() => setIsCoinsModalOpen(true)} size={"sm"} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white cursor-pointer">Adicionar mais</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Plan Status */}
            {user.subscription?.plan.name === "Pro" && session ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-5">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-yellow-800">Plano PRO</h4>
                    <p className="text-xs text-yellow-600">Acesso completo</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-yellow-700">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-3"></div>
                    <span>IA ilimitada</span>
                  </div>
                  <div className="flex items-center text-sm text-yellow-700">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-3"></div>
                    <span>Suporte prioritário</span>
                  </div>
                  <div className="flex items-center text-sm text-yellow-700">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-3"></div>
                    <span>Análises avançadas</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50 rounded-2xl p-5">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-800">Plano Gratuito</h4>
                    <p className="text-xs text-purple-600">Recursos limitados</p>
                  </div>
                </div>

                <p className="text-sm text-purple-700 mb-4 leading-relaxed">
                  Desbloqueie todo o potencial da IA e acelere suas vendas
                </p>

                {session ? (
                  <Button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade para PRO
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Upgrade para PRO
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

            {/* Menu Actions */}
            <div className="space-y-2 mb-6">
              {user.subscription?.plan.name === "Pro" && session && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 bg-white/40 h-12 px-4 rounded-xl font-medium cursor-pointer"
                  onClick={() => {
                    router.push("/plan-view")
                    setIsOpen(false)
                  }}
                >
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <Crown className="w-4 h-4 text-yellow-600" />
                  </div>
                  Gerenciar Assinatura
                </Button>
              )}
            </div>

            {/* Logout */}
            {user && session && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 bg-white/50 backdrop-blur-sm font-medium rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da Conta
              </Button>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 text-center">
              <p className="text-xs text-gray-400">
                Capshop v1.0.0
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        trigger="sidebar"
      />

      <CoinsModal isOpen={isCoinsModalOpen} setIsOpen={setIsCoinsModalOpen} />

    </header>
  )
}
