"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LayoutDashboard, Key, Brain, Settings, Menu, X, CreditCard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

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

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-56 border-r border-border bg-surface lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-14 items-center gap-2 border-b border-border px-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-glow">
              <Brain className="h-4 w-4 text-accent-cyan" />
            </div>
            <span className="text-base font-semibold text-foreground">Memory Layer</span>
            <span className="ml-auto rounded bg-accent-glow px-1.5 py-0.5 text-xs font-medium text-accent-cyan">
              FREE
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-glow">
            <Brain className="h-5 w-5 text-accent-cyan" />
          </div>
          <span className="text-lg font-semibold text-foreground">Memory Layer</span>
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-glow">
                <Brain className="h-5 w-5 text-accent-cyan" />
              </div>
              <span className="text-lg font-semibold text-foreground">Memory Layer</span>
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
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-foreground hover:bg-accent-hover transition-colors">
              <span>memoryhub</span>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md bg-accent-glow px-2.5 py-1 sm:flex">
              <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
              <span className="text-xs font-medium text-foreground">ALL OK</span>
            </div>

            <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent-hover hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>

            <button className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors">
              Upgrade
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-md p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent-purple text-foreground text-xs">HA</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
