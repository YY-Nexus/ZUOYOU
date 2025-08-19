import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { ResponsiveLayoutProvider } from "@/components/layout/responsive-layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "YYC³ - 客户关怀中心",
  description: "企业级客户关怀管理系统解决方案",
  generator: "v0.dev",
  openGraph: {
    images: ["/images/yanyu-cloud-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/yanyu-cloud-logo.png"],
    creator: "言语云",
  },
  icons: {
    icon: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ResponsiveLayoutProvider>{children}</ResponsiveLayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
