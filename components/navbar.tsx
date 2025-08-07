"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationSheet } from "./notificationsSheet"

export function Navbar() {
  return (
    <header className="h-16 glass-effect px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4"/>

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
        <NotificationSheet />

        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm">U</AvatarFallback>
        </Avatar>
      </div>

    </header>
  )
}
