"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUser, UserButton, useAuth } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import * as Sentry from '@sentry/nextjs'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Key, Brain, Settings, Menu, X, CreditCard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BillingService } from "@/services/billing.service"
import { FeedbackButton } from "./FeedbackButton"

const projectNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Memories", href: "/dashboard/memories", icon: Brain },
]

const accountNav = [
  { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [currentPlan, setCurrentPlan] = useState<string>("free")
  const [apiStatus, setApiStatus] = useState<"ok" | "checking" | "error">("checking")

  // Identify user in Sentry when authenticated
  useEffect(() => {
    if (isLoaded && user) {
      Sentry.setUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        username: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        createdAt: user.createdAt?.toString() || "",
      })
    }
  }, [isLoaded, user])

  // Fetch current plan
  useEffect(() => {
    const fetchPlan = async () => {
      if (!isLoaded || !user) return

      const billingData = await BillingService.getSubscriptionData(getToken)
      if (billingData?.subscription?.planId) {
        setCurrentPlan(billingData.subscription.planId)
      }
    }

    fetchPlan()
  }, [isLoaded, user, getToken])

  // Check API health on load only
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          setApiStatus("ok")
        } else {
          setApiStatus("error")
        }
      } catch (error) {
        setApiStatus("error")
      }
    }

    // Check once on component mount
    checkApiHealth()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-56 border-r border-border bg-surface lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-14 items-center gap-2 border-b border-border px-4">
            <div className="relative h-7 w-7">
              <Image
                src="/logo-small.png"
                alt="PersistQ Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <span className="text-base font-semibold text-foreground">PersistQ</span>
            <span className={cn(
              "ml-auto rounded px-1.5 py-0.5 text-xs font-medium uppercase",
              currentPlan === "free" && "bg-accent-glow text-accent-cyan",
              currentPlan === "starter" && "bg-blue-500/10 text-blue-500",
              currentPlan === "pro" && "bg-purple-500/10 text-purple-500",
              currentPlan === "premium" && "bg-amber-500/10 text-amber-500"
            )}>
              {currentPlan}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-6 px-3 py-4">
            <div className="space-y-1">
              <div className="px-2 text-xs font-medium text-muted-foreground mb-2">PROJECT</div>
              {projectNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <button
                      className={cn(
                        "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent-hover hover:text-foreground transition-colors",
                        isActive && "bg-accent-hover text-foreground font-medium",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </button>
                  </Link>
                )
              })}
            </div>

            <div className="space-y-1">
              <div className="px-2 text-xs font-medium text-muted-foreground mb-2">ACCOUNT</div>
              {accountNav.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <button
                      className={cn(
                        "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent-hover hover:text-foreground transition-colors",
                        isActive && "bg-accent-hover text-foreground font-medium",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </button>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image
              src="/logo-small.png"
              alt="PersistQ Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-semibold text-foreground">PersistQ</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image
                  src="/logo-small.png"
                  alt="PersistQ Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-foreground">PersistQ</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-1 p-4">
            {projectNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-muted-foreground hover:bg-accent-hover hover:text-foreground",
                      isActive && "bg-accent-hover text-foreground border-l-2 border-accent-cyan rounded-l-none",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
            {accountNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-muted-foreground hover:bg-accent-hover hover:text-foreground",
                      isActive && "bg-accent-hover text-foreground border-l-2 border-accent-cyan rounded-l-none",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-56">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60 px-6">
          {/* Left side - can add breadcrumbs or context here if needed */}
          <div className="flex items-center gap-3">
            {/* Removed redundant project switcher - logo already shows PersistQ */}
          </div>

          <div className="flex items-center gap-3">
            <div className={cn(
              "hidden items-center gap-2 rounded-md px-2.5 py-1 sm:flex",
              apiStatus === "ok" && "bg-accent-glow",
              apiStatus === "error" && "bg-red-500/10",
              apiStatus === "checking" && "bg-yellow-500/10"
            )}>
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                apiStatus === "ok" && "bg-accent-cyan",
                apiStatus === "error" && "bg-red-500",
                apiStatus === "checking" && "bg-yellow-500 animate-pulse"
              )} />
              <span className={cn(
                "text-xs font-medium",
                apiStatus === "ok" && "text-foreground",
                apiStatus === "error" && "text-red-500",
                apiStatus === "checking" && "text-yellow-500"
              )}>
                {apiStatus === "ok" && "All Systems OK"}
                {apiStatus === "error" && "API Issues"}
                {apiStatus === "checking" && "Checking..."}
              </span>
            </div>

            {/* Only show Upgrade button if user is on free plan */}
            {currentPlan === "free" && (
              <Link href="/dashboard/billing">
                <Button className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:bg-foreground/90">
                  Upgrade
                </Button>
              </Link>
            )}

            <UserButton
              appearance={{
                baseTheme: dark,
                variables: {
                  colorPrimary: '#00e0ff',
                  colorBackground: '#181818',
                  colorInputBackground: '#2a2a2a',
                  colorInputText: '#ffffff',
                },
                elements: {
                  userButtonPopoverCard: 'bg-[#181818] border border-[#2a2a2a]',
                  userButtonPopoverActionButton: 'hover:bg-[#1e1e1e]',
                  userButtonPopoverActionButtonText: 'text-white',
                  userButtonPopoverFooter: '!hidden',
                  modalContent: 'bg-[#181818]',
                },
              }}
              userProfileProps={{
                appearance: {
                  baseTheme: dark,
                  variables: {
                    colorPrimary: '#00e0ff',
                    colorBackground: '#181818',
                    colorInputBackground: '#2a2a2a',
                    colorInputText: '#ffffff',
                  },
                  elements: {
                    card: 'bg-[#181818] border border-[#2a2a2a]',
                    navbar: 'bg-[#181818]',
                    navbarButton: 'hover:bg-[#1e1e1e] text-white',
                    pageScrollBox: 'bg-[#181818]',
                    formButtonPrimary: 'bg-[#00e0ff] hover:bg-[#00c8e6] text-black',
                    footer: '!hidden',
                    headerTitle: 'text-white',
                    headerSubtitle: 'text-gray-400',
                  },
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="API Keys"
                  labelIcon={<Key className="w-4 h-4" />}
                  href="/dashboard/api-keys"
                />
                <UserButton.Link
                  label="Billing"
                  labelIcon={<CreditCard className="w-4 h-4" />}
                  href="/dashboard/billing"
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8 relative">
  {children}
  <FeedbackButton />
</main>
      </div>
    </div>
  )
}

export default DashboardLayout
