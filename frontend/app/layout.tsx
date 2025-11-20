import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from "@clerk/nextjs"
import { HighlightInit } from '@highlight-run/next/client'
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PersistQ - AI Agent Memory API",
  description: "Professional dashboard for PersistQ - persistent long-term memory for AI agents",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Only enable Highlight.io in production to save quota
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <>
      {isProduction && (
        <HighlightInit
          projectId={process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID || '5g5y914e'}
          serviceName="memoryhub-frontend"
          environment={process.env.NODE_ENV}
          tracingOrigins={true}
          networkRecording={{
            enabled: true,
            recordHeadersAndBody: true,
            urlBlocklist: [
              // Block sensitive endpoints from being recorded
              '/api/webhooks/clerk',
            ],
          }}
        />
      )}

      <ClerkProvider>
        <html lang="en" className="dark">
          <body className={`font-sans antialiased`}>
            {children}
            <Analytics />
            <SpeedInsights />
          </body>
        </html>
      </ClerkProvider>
    </>
  )
}
