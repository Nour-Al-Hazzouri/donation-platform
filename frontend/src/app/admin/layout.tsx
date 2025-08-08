import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - GiveLeb",
  description: "Admin dashboard for managing GiveLeb platform",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
