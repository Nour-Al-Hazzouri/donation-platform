'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layouts/MainLayout'
import UserProfileDashboard from '@/components/profile/UserProfileDashboard'
import NotificationsDashboard from '@/components/profile/NotificationsDashboard'
import { useAuthStore } from '@/store/authStore'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function ProfilePage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeView, setActiveView] = useState<'profile' | 'notifications'>('profile')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
    
    const view = searchParams.get('view')
    if (view === 'notifications') {
      setActiveView('notifications')
    } else if (view === 'profile') {
      setActiveView('profile')
    }
  }, [isAuthenticated, router, searchParams])

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <SidebarProvider>
        {activeView === 'profile' ? (
          <UserProfileDashboard onViewChange={setActiveView} />
        ) : (
          <NotificationsDashboard onViewChange={setActiveView} />
        )}
      </SidebarProvider>
    </MainLayout>
  )
}
