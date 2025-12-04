import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <DashboardLayout>{children}</DashboardLayout>
    </ErrorBoundary>
  )
}
