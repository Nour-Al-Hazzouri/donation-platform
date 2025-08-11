'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layouts/MainLayout'
import UserProfileDashboard from '@/components/profile/UserProfileDashboard'
import NotificationsDashboard from '@/components/profile/NotificationsDashboard'
import { useAuthStore } from '@/store/authStore'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function ProfilePage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [activeView, setActiveView] = useState<'profile' | 'notifications'>('profile')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
    
    // Check if there's a view preference in sessionStorage
    const storedView = sessionStorage.getItem('profileView')
    if (storedView === 'notifications') {
      setActiveView('notifications')
      // Clear the stored view to avoid persisting across page refreshes
      sessionStorage.removeItem('profileView')
    }
  }, [isAuthenticated, router])

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