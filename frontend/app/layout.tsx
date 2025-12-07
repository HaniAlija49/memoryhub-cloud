import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from "@clerk/nextjs"
import { CookieConsent } from "@/components/cookie-consent"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://persistq.com'),
  title: {
    default: "PersistQ – Semantic Memory API for AI",
    template: "%s | PersistQ"
  },
  description: "PersistQ is a private, cost-effective semantic memory API for AI developers. Zero embedding costs, local Transformers.js, and transparent pricing.",
  keywords: ["semantic memory API", "AI memory storage", "vector database", "AI agent memory", "pgvector", "transformers.js", "local embeddings"],
  authors: [{ name: "PersistQ" }],
  creator: "PersistQ",
  publisher: "PersistQ",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "PersistQ – Semantic Memory API for AI",
    description: "Private, cost-effective semantic memory API for AI developers with zero embedding costs",
    siteName: "PersistQ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PersistQ - Semantic Memory API for AI"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "PersistQ – Semantic Memory API for AI",
    description: "Private, cost-effective semantic memory API for AI developers with zero embedding costs",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PersistQ",
    "url": "https://persistq.com",
    "logo": "https://persistq.com/logo.png",
    "description": "Private, cost-effective semantic memory API for AI developers",
    "sameAs": [
      // Add your social media URLs when available
      // "https://twitter.com/persistq",
      // "https://github.com/persistq"
    ]
  }

  return (
    <ClerkProvider
      signInUrl="/login"
      signUpUrl="/signup"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
        <html lang="en" className="dark">
          <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
          </head>
          <body className={`font-sans antialiased`}>
            {children}
            <CookieConsent />
            <Analytics />
            <SpeedInsights />
          </body>
        </html>
      </ClerkProvider>
  )
}
