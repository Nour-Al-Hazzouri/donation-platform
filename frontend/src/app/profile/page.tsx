'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layouts/MainLayout'
import UserProfileDashboard from '@/components/profile/UserProfileDashboard'
import NotificationsDashboard from '@/components/profile/NotificationsDashboard'
import { useAuthStore } from '@/lib/store/authStore'

export default function ProfilePage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [activeView, setActiveView] = useState<'profile' | 'notifications'>('profile')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      {activeView === 'profile' ? (
        <UserProfileDashboard onViewChange={setActiveView} />
      ) : (
        <NotificationsDashboard onViewChange={setActiveView} />
      )}
    </MainLayout>
  )
}