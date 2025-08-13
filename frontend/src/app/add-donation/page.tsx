'use client'

import { MainLayout } from "@/components/layouts/MainLayout"
import { AddDonationContent } from '@/components/add-donation/AddDonationContent'
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddDonationPage() {
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      // Store current URL for redirection after authentication
      localStorage.setItem('redirectAfterAuth', window.location.pathname)
      // Open sign-in modal instead of redirecting
      openModal('signIn')
    }
  }, [isAuthenticated, openModal])

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <AddDonationContent />
    </MainLayout>
  )
}