"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <div
      className={`fixed bottom-8 right-8 z-40 transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <Button
        onClick={scrollToTop}
        size="sm"
        className="bg-accent-cyan hover:bg-accent-cyan/90 text-black shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 flex items-center justify-center p-0 group"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
      </Button>
    </div>
  )
}