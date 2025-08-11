'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRequestsStore, initialRequestsData } from "@/store/requestsStore"
import { MainLayout } from '@/components/layouts/MainLayout'
import { COLORS } from '@/utils/constants'
import Image from 'next/image'
import { useEffect } from 'react'
import { HowDonationHelps } from '@/components/donations/HowDonationHelps'

// More robust helper to parse amounts, handling various types and ensuring a number is returned
const parseAmount = (value: string | number | undefined | null): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = parseFloat(value.replace(/[^0-9.-]+/g,""));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export default function RequestDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = parseInt(params.id as string)
  const { requests, initializeRequests } = useRequestsStore()

  useEffect(() => {
    initializeRequests(initialRequestsData)
  }, [initializeRequests])

  const request = requests.find(req => req.id === requestId)

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <MainLayout>
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Request Not Found</h1>
              <p className="text-muted-foreground mb-6">The request you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/')} className="bg-red-500 hover:bg-red-600 text-white">
                Back to Requests
              </Button>
            </div>
          </main>
        </MainLayout>
      </div>
    )
  }

  // Use the robust parseAmount function for both goal and current amounts
  const requestGoalAmount = parseAmount(request.goalAmount)
  const requestCurrentAmount = parseAmount(request.currentAmount)

  const getDateCreated = (request: any) => {
    if (request.createdAt) {
      const createdDate = new Date(request.createdAt)
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60))
      
      if (diffInHours < 1) return 'Just now'
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
      
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
      
      const diffInWeeks = Math.floor(diffInDays / 7)
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
    }
    return '2 days ago' // Fallback for old requests
  }

  const requestDetails = {
    ...request,
    requestAmount: requestGoalAmount.toLocaleString(),
    currentAmount: requestCurrentAmount.toLocaleString(),
    currency: '$',
    fullDescription: request.description + ' ' + 
      'We are reaching out to our community for support during this difficult time. Every contribution, no matter how small, brings us closer to our goal and gives us hope for a better tomorrow. Your kindness and generosity mean everything to us.',
    dateCreated: getDateCreated(request),
    location: 'Lebanon'
  }

  const progressPercentage = (requestCurrentAmount / requestGoalAmount) * 100

  const handleDonateClick = () => {
    router.push(`/donate/${requestId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <MainLayout>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Updated Back Button to match Community page */}
          <div className="mb-4 md:mb-6">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8 rounded-full bg-background/80 hover:bg-background/90 shadow-md"
              style={{ color: COLORS.primary }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Request Details</h1>
          </div>

          {/* Request Details Card */}
          <div className="bg-card rounded-lg shadow-sm border p-4 md:p-8">
            {/* User Profile Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className="relative mr-3 md:mr-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
                    <AvatarImage src={request.avatarUrl || "/placeholder.svg"} alt={request.name} />
                    <AvatarFallback className="text-sm md:text-lg">{request.initials}</AvatarFallback>
                  </Avatar>
                  {request.isVerified && (
                    <div className="absolute -top-1 -right-1">
                      <Image
                        src="/verification.png"
                        alt="Verified"
                        width={16}
                        height={16}
                        className="rounded-full border-2 border-background"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1 md:gap-2 mb-1">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">{request.name}</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{requestDetails.location} • {requestDetails.dateCreated}</p>
                </div>
              </div>
             
            </div>

            {/* Request Title */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-2">{request.title}</h3>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-card-foreground">Progress</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 sm:h-3 mb-3 sm:mb-4">
                <div 
                  className="bg-red-500 h-2 sm:h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                <div className="bg-muted rounded-lg p-2 sm:p-4">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-500 dark:text-red-400">{requestDetails.currency}{requestDetails.currentAmount}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Raised so far</p>
                </div>
                <div className="bg-muted rounded-lg p-2 sm:p-4">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{requestDetails.currency}{requestDetails.requestAmount}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Goal amount</p>
                </div>
              </div>
            </div>

            {/* Request Image - Updated for better responsiveness */}
            {request.imageUrl && (
              <div className="mb-4 md:mb-6 w-full aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={request.imageUrl || "/placeholder.svg"}
                  alt={request.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                  priority
                />
              </div>
            )}

            {/* Full Description */}
            <div className="mb-6 md:mb-8">
              <h4 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">About this request</h4>
              <p className="text-sm sm:text-base text-card-foreground leading-relaxed whitespace-pre-line">
                {requestDetails.fullDescription}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              <Button 
                onClick={handleDonateClick}
                className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg"
              >
                Donate Now
              </Button>
            </div>
          </div>

          {/* How Donation Helps Section */}
          <div className="mt-6 md:mt-8">
            <HowDonationHelps />
          </div>
        </main>
      </MainLayout>
    </div>
  )
}
