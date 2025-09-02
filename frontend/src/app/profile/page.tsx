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
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openModal } = useModal()
  const [activeView, setActiveView] = useState<'profile' | 'notifications'>('profile')

  // Track if we've already shown the login modal
  const [hasShownLoginModal, setHasShownLoginModal] = useState(false)
  // Track if we've checked for stored auth state
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false)

  useEffect(() => {
    // Check if auth state is stored in localStorage
    if (typeof window !== 'undefined' && !hasCheckedStorage) {
      const storedAuth = localStorage.getItem('auth-storage')
      if (storedAuth) {
        try {
          const parsedAuth = JSON.parse(storedAuth)
          // If we have valid auth data in storage, don't show the login modal
          if (parsedAuth?.state?.isAuthenticated && parsedAuth?.state?.user) {
            setHasCheckedStorage(true)
            return
          }
        } catch (error) {
          console.error('Error parsing auth storage:', error)
        }
      }
      setHasCheckedStorage(true)
    }

    // Only show login modal if we've checked storage and user is not authenticated
    if (!isAuthenticated && hasCheckedStorage && !hasShownLoginModal) {
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
  }, [isAuthenticated, openModal, searchParams, hasShownLoginModal, hasCheckedStorage])

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
