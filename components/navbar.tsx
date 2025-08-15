"use client"

import { Coins, Crown, LogIn, LogOut, Search, Sparkles, User, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationSheet } from "./notificationsSheet"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { PricingModal } from "./pricingModal"
import { useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import { CoinsModal } from "./coinsModal"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [isCoinsModalOpen, setIsCoinsModalOpen] = useState(false)
  const session = useSession().data

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

  return (
    <header className="h-16 glass-effect px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4" />

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquisar produtos..."
            className="pl-10 bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          onClick={() => setIsCoinsModalOpen(true)}
          size={"sm"}
          className="px-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 max-md:hidden
          hover:from-yellow-500 hover:to-orange-600 cursor-pointer text-zinc-50"
        >
          <span>{user.amount || "0"}</span>
          <Coins />
        </Button>

        <NotificationSheet />

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
                <SheetTitle className="text-left text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
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
                    <Crown className="w-4 h-4 mr-1" />
                    PRO
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-200 text-gray-700 hover:bg-gray-200 h-8 w-full">
                    FREE
                  </Badge>
                )}
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 ring-2 ring-white/50">
                    <AvatarImage src={user?.image || ''} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-semibold">
                      {user?.name?.split(' ')[0].split('')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex justify-between w-full">
                    <div className="flex justify-between w-full mt-2 relative">
                      <div className="flex flex-col">
                        <h1 className="font-bold text-gray-900 text-lg leading-tight mb-1">{user?.name?.split(' ')[0] + ' ' + user?.name?.split(' ')[1]}</h1>
                        <p className="text-sm text-gray-600 mb-3">{user?.email}</p>
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

            {user && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl px-5 py-3">
                <div className="flex items-center">
                  <div className="min-w-8 min-h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <Coins className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <h4 className="font-bold text-yellow-800">{user.amount || 0.00} Capcoins</h4>
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

                <Button
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade para PRO
                </Button>
              </div>
            )}

            {/* Menu Actions */}
            <div className="space-y-2 mb-6">
              {user.subscription?.plan.name === "Pro" && session && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 bg-white/40 h-12 px-4 rounded-xl font-medium cursor-pointer"
                  onClick={() => setIsOpen(false)}
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
