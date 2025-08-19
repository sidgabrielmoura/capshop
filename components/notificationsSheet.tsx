"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Bell, Check, X, MoreHorizontal, MessageCircleWarning } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import { Notification } from "@/lib/generated/prisma"
import { fetchNotifications } from "@/actions"

export function NotificationSheet() {
  const [notificationList, setNotificationList] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const userId = useSession().data?.user.id

  const unreadCount = notificationList.filter((n) => !n.read).length

  const handleMarkAsRead = async (ids: string[]) => {
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      body: JSON.stringify({ ids }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      setNotificationList((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)));
    }
  };

  const handleDeleteNotification = async (id: string) => {
    const res = await fetch("/api/notifications", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      setNotificationList((prev) => prev.filter((n) => n.id !== id));
    }
  };

  useEffect(() => {
    fetchNotifications().then((data) => {
      if (data) setNotificationList(data.notifications.reverse());
    })
  }, [userId]);

  const get_color = (notification: Notification) => {
    switch (notification.type) {
      case "DELETE_PRODUCT":
        return "bg-gradient-to-r from-red-500/80 to-red-700/80 text-white";
      case "CREATE_SEO":
        return "bg-gradient-to-r from-green-500/80 to-green-700/80 text-white";
      case "CREATE_PRODUCT":
        return "bg-gradient-to-r from-yellow-400/80 to-yellow-600/80 text-yellow-900";
      case "BUY_COINS":
        return "bg-gradient-to-r from-blue-500/80 to-blue-700/80 text-white";
      case "CREATE_PLAN":
        return "bg-gradient-to-r from-purple-500/80 to-purple-700/80 text-white";
      default:
        return "bg-gradient-to-r from-slate-400/80 to-slate-600/80 text-white";
    }
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
                  <X />
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
                  onClick={() => handleMarkAsRead(notificationList.map((n) => n.id))}
                  className="text-xs bg-white/50 border-white/30 hover:bg-white/70 w-1/2 flex-1 cursor-pointer"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
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
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="space-y-3 px-2">
              {notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative p-4 rounded-xl transition-all duration-200 cursor-pointer ${notification.read ? "bg-white/30 hover:bg-white/40" : "bg-white/60 hover:bg-white/70 shadow-sm"
                    }`}
                  onClick={() => !notification.read && handleMarkAsRead([notification.id])}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${get_color(notification)}`}
                    >
                      <MessageCircleWarning className="w-5 h-5 text-white" />
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
                                <DropdownMenuItem onClick={() => handleMarkAsRead([notification.id])}>
                                  <Check className="w-4 h-4 mr-2" />
                                  Marcar como lida
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteNotification(notification.id)}
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
                        {notification.message}
                      </p>

                      <span className="text-xs text-gray-400 mt-2 block">{new Date(notification.createdAt).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}</span>
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
