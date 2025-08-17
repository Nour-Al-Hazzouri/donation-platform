'use client'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { MainLayout } from "@/components/layouts/MainLayout"
import AddRequestContent from '@/components/add-request/AddRequestContent'
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'
import { useEffect, useState } from 'react'

export default function AddRequestPage() {
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  const [hasShownLoginModal, setHasShownLoginModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated && !hasShownLoginModal) {
      openModal('signIn')
      setHasShownLoginModal(true)
    }
  }, [isAuthenticated, openModal, hasShownLoginModal])

  if (!isAuthenticated) return null

  return (
    <MainLayout>
      <AddRequestContent />
    </MainLayout>
  )
}
