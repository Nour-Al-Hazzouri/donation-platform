'use client'

import { MainLayout } from "@/components/layouts/MainLayout"
import { AddRequestContent } from '@/components/add-request/AddRequestContent'
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddRequestPage() {
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  const router = useRouter()

  // Track if we've already shown the login modal
  const [hasShownLoginModal, setHasShownLoginModal] = useState(false)

  useEffect(() => {
    // Check authentication when component mounts
    if (!isAuthenticated && !hasShownLoginModal) {
      // Store current URL for redirection after authentication
      localStorage.setItem('redirectAfterAuth', window.location.pathname)
      // Open sign-in modal instead of redirecting
      openModal('signIn')
      // Mark that we've shown the modal
      setHasShownLoginModal(true)
    }
  }, [isAuthenticated, openModal, hasShownLoginModal])

  // If not authenticated, don't render the page content
  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <AddRequestContent />
    </MainLayout>
  )
}
