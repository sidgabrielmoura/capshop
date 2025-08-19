import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import AuthProvider from "../providers/auth"
import { Toaster } from "@/components/ui/sonner"
import { ProductsProvider } from "@/providers/productsProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Capshop - Gerenciamento de Produtos",
  description: "Plataforma moderna para gerenciar seus produtos com IA",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <ProductsProvider>
          <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
            <div className="flex">
              <Sidebar />
              <div className="flex-1 lg:ml-64">
                <Navbar />
                <main className="p-4 lg:p-8">{children}</main>
                <Toaster />
              </div>
            </div>
          </div>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
