"use client"

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import type React from "react"
import { AdminHeader } from "@/components/common/AdminHeader"
import { Footer } from "@/components/common/Footer"
import { COLORS } from "@/lib/constants"

interface MainLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader />

      {/* Main content area - full width on mobile, adjusted for sidebar on md+ screens */}
      <div className="flex flex-1 w-full overflow-x-hidden">{children}</div>

      {/* Footer - no sidebar overlap on mobile, margin on md+ screens */}
      <div className="ml-0 md:ml-64 transition-all duration-200 ease-linear">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}
