'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layouts/MainLayout'
import UserProfileDashboard from '@/components/profile/UserProfileDashboard'
import { useAuthStore } from '@/lib/store/authStore'

export default function ProfilePage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // If not authenticated, don't render anything while redirecting
  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <UserProfileDashboard />
    </MainLayout>
  )
}