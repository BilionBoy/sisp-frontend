import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"
import "leaflet/dist/leaflet.css"
import "../styles/map.css"
import "../styles/mobile.css"
import { SidebarProvider } from "@/lib/contexts/sidebar-context"
import { FullscreenProvider } from "@/lib/contexts/fullscreen-context"
import { Providers } from "./providers"

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

export const metadata: Metadata = {  title: "SISP Porto Velho - Sistema Integrado de Segurança Pública",  description: "Plataforma inteligente de gestão e monitoramento da segurança pública municipal",  generator: "v0.app",  viewport: {    width: "device-width",    initialScale: 1,    maximumScale: 5,    userScalable: true,    viewportFit: "cover",  },  themeColor: [    { media: "(prefers-color-scheme: light)", color: "#ffffff" },    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },  ],  appleWebApp: {    capable: true,    statusBarStyle: "default",    title: "SISP",  },  formatDetection: {    telephone: false,  },}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>
        <Providers>
          <FullscreenProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </FullscreenProvider>
        </Providers>
      </body>
    </html>
  )
}
