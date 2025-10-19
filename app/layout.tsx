import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"
import "leaflet/dist/leaflet.css"
import "../styles/map.css"
import { SidebarProvider } from "@/lib/contexts/sidebar-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SISP Porto Velho - Sistema Integrado de Segurança Pública",
  description: "Plataforma inteligente de gestão e monitoramento da segurança pública municipal",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  )
}
