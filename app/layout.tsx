import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarWrapper } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Buff Comply - Compliance Monitoring Tool",
  description: "Herramienta de monitoreo de cumplimiento para sitios web y búsquedas de Google",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  )
}

