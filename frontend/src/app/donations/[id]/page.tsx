'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainLayout } from '@/components/layouts/MainLayout'
import { useDonationsStore } from '@/store/donationsStore'
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'
import Image from 'next/image'
import { COLORS } from '@/utils/constants'

export default function DonationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const donationId = Number(params.id)
  const { donations } = useDonationsStore()
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  
  // Find the donation by ID from the store
  const donation = donations.find(donation => donation.id === donationId)
  
  if (!donation) {
    return (
      <div className="min-h-screen bg-background">
        <MainLayout>
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Donation Not Found</h1>
              <p className="text-muted-foreground mb-6">The donation you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/donations')} className="bg-red-500 hover:bg-red-600 text-white">
                Back to Donations
              </Button>
            </div>
          </main>
        </MainLayout>
      </div>
    )
  }

  const handleRequest = () => {
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }
    router.push(`/request/${donationId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <MainLayout>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Back Button - Updated to match carousel style */}
          <div className="mb-4 md:mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className={cn(
                "h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md"
              )}
              style={{ color: COLORS.primary }}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Donation Details</h1>
          </div>

          {/* Donation Details Card */}
          <div className="bg-card rounded-lg shadow-sm border p-4 md:p-8">
            {/* User Profile Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className="relative mr-3 md:mr-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
                    <AvatarImage src={donation.avatarUrl || "/placeholder.svg"} alt={donation.name} />
                    <AvatarFallback className="text-sm md:text-lg">{donation.initials}</AvatarFallback>
                  </Avatar>
                  {donation.isVerified && (
                    <div className="absolute -top-1 -right-1">
                      <Image 
                        src="/verification.png" 
                        alt="Verified" 
                        width={16} 
                        height={16}
                        className="rounded-full border-2 border-white"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1 md:gap-2 mb-1">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">{donation.name}</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Lebanon • {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="self-end sm:self-auto">
                Report
              </Button>
            </div>

            {/* Donation Title */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-2">{donation.title}</h3>
            </div>

            {/* Donation Image */}
            {donation.imageUrl && (
              <div className="mb-4 md:mb-6 w-full aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={donation.imageUrl}
                  alt={donation.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                  priority
                />
              </div>
            )}

            {/* Full Description */}
            <div className="mb-6 md:mb-8">
              <h4 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">About this donation</h4>
              <p className="text-sm sm:text-base text-card-foreground leading-relaxed whitespace-pre-line">
                {donation.description}
              </p>
            </div>

            {/* Request Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleRequest}
                className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg"
              >
                Request Now
              </Button>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-6 md:mt-8 bg-card rounded-lg shadow-sm border p-4 md:p-6">
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">How to request this donation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-red-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-red-500 mb-1 md:mb-2">100%</div>
                <p className="text-xs sm:text-sm text-muted-foreground">of donations go directly to those in need</p>
              </div>
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-500 mb-1 md:mb-2">24/7</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Support and updates on progress</p>
              </div>
              <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-500 mb-1 md:mb-2">Secure</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Safe and encrypted transactions</p>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}