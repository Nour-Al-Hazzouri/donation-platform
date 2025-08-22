'use client'

import React from "react"
import { Header } from "@/components/common/Header"
import { Footer } from "@/components/common/Footer"
import { usePathname } from "next/navigation"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isProfilePage = pathname?.startsWith('/profile')
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow max-w-6xl mx-auto px-6 py-8 w-full">{children}</main>
      <Footer className={isProfilePage ? "md:pl-72" : ""} />
    </div>
  )
}