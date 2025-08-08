"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main admin page
    router.push("/admin")
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Redirecting...</h1>
        <p className="text-gray-500">Taking you to the admin dashboard</p>
      </div>
    </div>
  )
}