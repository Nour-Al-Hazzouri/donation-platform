'use client'

import { MainLayout } from "@/components/layouts/MainLayout"
import { AddDonationContent } from '@/components/add-donation/AddDonationContent'
import { useAuthStore } from '@/lib/store/authStore'
import { useModal } from '@/lib/contexts/ModalContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddDonationPage() {
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      openModal('signIn')
    }
  }, [isAuthenticated, openModal, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <AddDonationContent />
    </MainLayout>
  )
}