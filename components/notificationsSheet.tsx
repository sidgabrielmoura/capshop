"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Check, Sparkles, Package, Settings, X, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Notification {
  id: string
  type: "product" | "ai" | "system" | "success"
  title: string
  description: string
  time: string
  read: boolean
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Produto criado com sucesso!",
    description: "Smartphone Galaxy Pro foi adicionado à sua loja",
    time: "2 min atrás",
    read: false,
    icon: Package,
    color: "bg-green-500",
  },
  {
    id: "2",
    type: "ai",
    title: "IA gerou nova descrição",
    description: "Descrição otimizada criada para Fone Bluetooth Premium",
    time: "15 min atrás",
    read: false,
    icon: Sparkles,
    color: "bg-purple-500",
  },
  {
    id: "3",
    type: "system",
    title: "Configuração atualizada",
    description: "Suas preferências de IA foram salvas com sucesso",
    time: "1 hora atrás",
    read: true,
    icon: Settings,
    color: "bg-blue-500",
  },
  {
    id: "4",
    type: "product",
    title: "Produto visualizado",
    description: "Smartwatch Fitness recebeu 5 novas visualizações",
    time: "2 horas atrás",
    read: true,
    icon: Package,
    color: "bg-orange-500",
  },
  {
    id: "5",
    type: "ai",
    title: "Créditos IA utilizados",
    description: "Você usou 3 créditos para gerar conteúdo hoje",
    time: "3 horas atrás",
    read: true,
    icon: Sparkles,
    color: "bg-purple-500",
  },
  {
    id: "6",
    type: "success",
    title: "Backup realizado",
    description: "Todos os seus produtos foram salvos automaticamente",
    time: "1 dia atrás",
    read: true,
    icon: Check,
    color: "bg-green-500",
  },
]

export function NotificationSheet() {
  const [notificationList, setNotificationList] = useState(notifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notificationList.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearAll = () => {
    setNotificationList([])
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative hover:bg-white/20 cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 hover:bg-red-500 text-white text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:w-96 bg-gradient-to-br from-pink-50/95 via-purple-50/95 to-blue-50/95 backdrop-blur-xl border-white/20">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Notificações
            </SheetTitle>
            <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {unreadCount} novas
                </Badge>
                )}

                <SheetClose asChild>
                    <Button variant={'outline'} size={'icon'} className="cursor-pointer">
                            <X/>
                    </Button>
                </SheetClose>
            </div>
          </div>

          {notificationList.length > 0 && (
            <div className="flex gap-2 pt-2 w-full">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs bg-white/50 border-white/30 hover:bg-white/70 w-1/2 flex-1 cursor-pointer"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-xs bg-white/50 border-white/30 hover:bg-white/70 text-red-600 hover:text-red-700 w-1/2 flex-1 cursor-pointer"
              >
                <X className="w-3 h-3 mr-1" />
                Limpar todas
              </Button>
            </div>
          )}
        </SheetHeader>

        <Separator className="bg-white/30" />

        {notificationList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhuma notificação</h3>
            <p className="text-sm text-gray-600">Você está em dia com tudo!</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-180px)] pr-4">
            <div className="space-y-3 py-4 px-2">
              {notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                    notification.read ? "bg-white/30 hover:bg-white/40" : "bg-white/60 hover:bg-white/70 shadow-sm"
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 ${notification.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <notification.icon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                          {notification.title}
                        </h4>

                        <div className="flex items-center gap-1">
                          {!notification.read && <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              {!notification.read && (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  <Check className="w-4 h-4 mr-2" />
                                  Marcar como lida
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <p className={`text-sm mt-1 ${notification.read ? "text-gray-500" : "text-gray-600"}`}>
                        {notification.description}
                      </p>

                      <span className="text-xs text-gray-400 mt-2 block">{notification.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {notificationList.length > 0 && (
          <>
            <Separator className="bg-white/30" />
            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full bg-white/50 border-white/30 hover:bg-white/70 text-purple-600 hover:text-purple-700"
                onClick={() => setIsOpen(false)}
              >
                Ver todas as notificações
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
