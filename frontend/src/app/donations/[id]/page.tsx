'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MainLayout } from '@/components/layouts/MainLayout'
import { useDonationsStore } from '@/store/donationsStore'
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'
import Image from 'next/image'
import { HowToRequest } from '@/components/requests/HowToRequest'
import { useEffect, useState } from 'react'

export default function DonationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const donationId = Number(params.id)
  const { getDonationById } = useDonationsStore()
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  const [donation, setDonation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDonation = async () => {
      try {
        const donationData = await getDonationById(donationId)
        setDonation(donationData)
      } catch (error) {
        console.error('Error loading donation:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadDonation()
  }, [donationId, getDonationById])

  if (isLoading) return <LoadingState />

  if (!donation) return <NotFoundState router={router} />

  const handleRequest = () => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterAuth', `/request/${donationId}`)
      openModal('signIn')
      return
    }
    router.push(`/request/${donationId}`)
  }

  // FIX: Normalize donation image URL
  const imageSrc = donation.imageUrl
    ? donation.imageUrl.startsWith('http')
      ? donation.imageUrl
      : `/${donation.imageUrl.replace(/^\/?/, '')}`
    : undefined

  return (
    <div className="min-h-screen bg-background">
      <MainLayout>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Back Button */}
          <div className="mb-4 md:mb-6">
            <Button 
              onClick={() => router.back()}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Donation Details</h1>
          </div>

          {/* Donation Card */}
          <div className="bg-card rounded-lg shadow-sm border p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className="relative mr-3 md:mr-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
                    <AvatarImage src={donation.avatarUrl || "/placeholder.svg"} alt={donation.name || 'User'} />
                    <AvatarFallback className="text-sm md:text-lg">{donation.initials || '?'}</AvatarFallback>
                  </Avatar>
                  {donation.isVerified && (
                    <div className="absolute -top-1 -right-1">
                      <Image src="/verification.png" alt="Verified" width={16} height={16} className="rounded-full border-2 border-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">{donation.name}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Lebanon • {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Donation Title */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-foreground">{donation.title || 'Donation'}</h3>
            </div>

            {/* Donation Image */}
            {imageSrc && (
              <div className="mb-4 md:mb-6 w-full aspect-video relative rounded-lg overflow-hidden">
                <Image src={imageSrc} alt={donation.title || 'Donation image'} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px" priority />
              </div>
            )}

            {/* Full Description */}
            <div className="mb-6 md:mb-8">
              <h4 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">About this donation</h4>
              <p className="text-sm sm:text-base text-card-foreground leading-relaxed whitespace-pre-line">{donation.description}</p>
            </div>

            {/* Request Button */}
            <div className="flex justify-center">
              <Button onClick={handleRequest} className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg">
                Request Now
              </Button>
            </div>
          </div>

          <div className="mt-6 md:mt-8">
            <HowToRequest />
          </div>
        </main>
      </MainLayout>
    </div>
  )
}

// Loading & Not Found states
function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
    </div>
  )
}

function NotFoundState({ router }: { router: any }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-foreground mb-4">Donation Not Found</h1>
      <Button onClick={() => router.push('/donations')} className="bg-red-500 hover:bg-red-600 text-white">Back to Donations</Button>
    </div>
  )
}
