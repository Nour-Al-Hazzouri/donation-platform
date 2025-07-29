'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NAV_ITEMS, COLORS } from "@/lib/constants"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/common/Navbar"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className={`w-8 h-8 bg-[${COLORS.primary}] rounded-sm flex items-center justify-center`}>
            <span className="text-white text-lg font-bold">♥</span>
          </div>
          <span className={`text-[${COLORS.text.primary}] text-xl font-semibold`}>GiveLeb</span>
        </Link>

        {/* Mobile Navigation */}
        <Navbar />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${isActive ? `text-[${COLORS.primary}] font-medium border-b-2 border-[${COLORS.primary}] pb-1` : `text-[${COLORS.text.secondary}] hover:text-[${COLORS.text.primary}]`}`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Auth Buttons - Desktop Only */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            className={`bg-[${COLORS.primary}] text-white border-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] rounded-full px-6`}
          >
            Sign In
          </Button>
          <Button className={`bg-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] text-white rounded-full px-6`}>
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  )
}