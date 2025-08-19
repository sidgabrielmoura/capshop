"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Package, Sparkles, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PricingModal } from "./pricingModal"
import { cn } from "@/app/lib/utils"
import { signIn, useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

export function Sidebar() {
  const pathname = usePathname()
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const user = useSession().data?.user

  const navigation = [
    {
      name: "Produtos",
      href: "/",
      icon: Package,
    },
    // {
    //   name: "Configuração da IA",
    //   href: "/engineAi",
    //   icon: Settings,
    // },
  ]

  const handleLogin = async () => {
    await signIn("google")
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Capshop
        </h1>

        {user?.subscription?.plan.name === "Pro" && <Sparkles className="w-5 h-5 text-amber-700 mr-2" />}
      </div>

      <div className="mb-8">
        {user ? (
          <Link href="/registerProduct" onClick={() => setIsMobileOpen(false)}>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </Link>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
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

      <nav className="flex-1">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-white/30 text-purple-700 shadow-sm"
                      : "text-gray-700 hover:bg-white/20 hover:text-purple-600",
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {user?.subscription?.plan.name !== "Pro" ? (
        <div className="mt-auto">
          <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
            <div className="flex items-center mb-2">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-700">IA Premium</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Gere títulos e descrições automaticamente</p>
            {user ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsPricingOpen(true)
                  setIsMobileOpen(false)
                }}
                className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
              >
                Fazer Upgrade
              </Button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                  >
                    Fazer Upgrade
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
        </div>
      ) : (
        <div className="mt-auto">
          <div className="p-4 bg-gradient-to-r from-amber-200/80 to-orange-300/60 rounded-xl">
            <div className="flex items-center mb-2">
              <Sparkles className="w-4 h-4 text-amber-700 mr-2" />
              <span className="text-sm font-medium text-amber-700">IA Premium</span>
            </div>
            <p className="text-xs text-zinc-800 mb-3">Gere títulos e descrições automaticamente</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 glass-effect border-r border-white/20 p-6">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-6 bg-gradient-to-br from-pink-50/95 via-purple-50/95 to-blue-50/95 backdrop-blur-xl border-white/20 glass-effect-clean"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} trigger="sidebar" />
    </>
  )
}
