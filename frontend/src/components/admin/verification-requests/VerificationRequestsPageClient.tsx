"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function VerificationRequestsPageClient() {
  const router = useRouter()

  // Redirect to the users page with the verification tab active
  useEffect(() => {
    router.replace("/admin/users?tab=verification")
  }, [router])

  return null
}