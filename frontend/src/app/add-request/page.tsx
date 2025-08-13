'use client'

import { MainLayout } from "@/components/layouts/MainLayout"
import { AddRequestContent } from '@/components/add-request/AddRequestContent'
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddRequestPage() {
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  const router = useRouter()

  useEffect(() => {
    // Check authentication when component mounts
    if (!isAuthenticated) {
      // Store current URL for redirection after authentication
      localStorage.setItem('redirectAfterAuth', window.location.pathname)
      // Open sign-in modal instead of redirecting
      openModal('signIn')
    }
  }, [isAuthenticated, openModal])

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
