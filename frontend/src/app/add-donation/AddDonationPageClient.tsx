'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layouts/MainLayout'
import { AddDonationContent } from '@/components/add-donation/AddDonationContent'
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'
import { useDonationsStore } from '@/store/donationsStore' // <-- make sure path is correct

// Shape expected from AddDonationContent's form submit.
// Adjust field names if your form differs.
type AddDonationFormValues = {
  title: string
  description: string
  type: 'request' | 'offer'
  goalAmount: number
  unit: string
  endDate: string // 'YYYY-MM-DD'
  locationId: number
  imageUrl?: string
}

export function AddDonationPageClient() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  const { addDonation } = useDonationsStore()

  const [hasShownLoginModal, setHasShownLoginModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ask unauthenticated users to sign in
  useEffect(() => {
    if (!isAuthenticated && !hasShownLoginModal) {
      localStorage.setItem('redirectAfterAuth', window.location.pathname)
      openModal('signIn')
      setHasShownLoginModal(true)
    }
  }, [isAuthenticated, hasShownLoginModal, openModal])

  // Handle form submit -> calls Zustand store -> hits your API
  const handleSubmit = useCallback(
    async (values: AddDonationFormValues) => {
      setSubmitting(true)
      setError(null)

      try {
        // Map form values to store's expected shape (Omit<DonationData, 'id'>)
        await addDonation({
          name: '',               // backend derives from auth user; keep blank
          title: values.title,
          description: values.description,
          imageUrl: values.imageUrl,
          avatarUrl: undefined,
          initials: '',           // UI-only; store will fill from user
          isVerified: true,       // UI flag
          goalAmount: values.goalAmount,
          currentAmount: 0,
          possibleAmount: 0,
          unit: values.unit,
          type: values.type,
          status: 'active',
          userId: undefined,      // backend derives from token
          locationId: values.locationId,
          endDate: values.endDate,
          location: null
        })

        // Success -> go to the donations list (adjust route if different)
        router.push('/donations')
      } catch (e: any) {
        setError(e?.response?.data?.message ?? 'Failed to create donation')
      } finally {
        setSubmitting(false)
      }
    },
    [addDonation, router]
  )

  if (!isAuthenticated) return null

  return (
    <MainLayout>
      {/* Pass submitting & error down if your component can show them */}
      <AddDonationContent onSubmit={handleSubmit} submitting={submitting} error={error} />
    </MainLayout>
  )
}
