"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Package, Settings, Sparkles, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PricingModal } from "./pricingModal"
import { cn } from "@/app/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const [isPricingOpen, setIsPricingOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navigation = [
    {
      name: "Produtos",
      href: "/",
      icon: Package,
    },
    {
      name: "Configuração da IA",
      href: "/engineAi",
      icon: Settings,
    },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Capshop
        </h1>
      </div>

      <div className="mb-8">
        <Link href="/registerProduct" onClick={() => setIsMobileOpen(false)}>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
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

      <div className="mt-auto">
        <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
          <div className="flex items-center mb-2">
            <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-700">IA Premium</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">Gere títulos e descrições automaticamente</p>
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
        </div>
      </div>
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
