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

export const metadata: Metadata = {
  title: "SISP Porto Velho - Sistema Integrado de Segurança Pública",
  description: "Plataforma inteligente de gestão e monitoramento da segurança pública municipal",
  applicationName: "SISP Porto Velho",
  keywords: ["segurança pública", "ocorrências", "Porto Velho", "gestão", "monitoramento"],
  authors: [{ name: "Prefeitura de Porto Velho" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SISP",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

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
