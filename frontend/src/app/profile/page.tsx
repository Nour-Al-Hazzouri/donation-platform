'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layouts/MainLayout'
import UserProfileDashboard from '@/components/profile/UserProfileDashboard'
import NotificationsDashboard from '@/components/profile/NotificationsDashboard'
import { useAuthStore } from '@/store/authStore'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useModal } from '@/contexts/ModalContext'

export default function ProfilePage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openModal } = useModal()
  const [activeView, setActiveView] = useState<'profile' | 'notifications'>('profile')

  // Track if we've already shown the login modal
  const [hasShownLoginModal, setHasShownLoginModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated && !hasShownLoginModal) {
      // Store current URL for redirection after authentication
      localStorage.setItem('redirectAfterAuth', window.location.pathname)
      // Open sign-in modal instead of redirecting
      openModal('signIn')
      // Mark that we've shown the modal
      setHasShownLoginModal(true)
      return
    }
    
    const view = searchParams.get('view')
    if (view === 'notifications') {
      setActiveView('notifications')
    } else if (view === 'profile') {
      setActiveView('profile')
    }
  }, [isAuthenticated, openModal, searchParams, hasShownLoginModal])

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
