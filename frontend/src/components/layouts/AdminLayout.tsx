'use client'

import React from "react"
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
      <main className="flex-grow max-w-6xl mx-auto px-6 py-8 w-full">{children}</main>
      <Footer />
    </div>
  )
}