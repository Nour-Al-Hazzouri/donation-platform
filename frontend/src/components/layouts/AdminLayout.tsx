"use client"
import type React from "react"
import { AdminHeader } from "@/components/common/AdminHeader"
import { Footer } from "@/components/common/Footer"
import { COLORS } from "@/lib/constants"

interface MainLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: MainLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-[${COLORS.background}]`}>
      <AdminHeader />

      {/* Main content area with sidebar */}
      <div className="flex flex-1">{children}</div>

      {/* Footer with proper margin to account for sidebar */}
      <div className="ml-64 transition-all duration-200 ease-linear">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}
