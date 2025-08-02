'use client'

import React from "react"
import { Header } from "@/components/common/Header"
import { Footer } from "@/components/common/Footer"
import { COLORS } from "@/lib/constants"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-[${COLORS.background}]`}>
      <Header />
      <main className="flex-grow max-w-6xl mx-auto px-6 py-8 w-full">{children}</main>
      <Footer />
    </div>
  )
}