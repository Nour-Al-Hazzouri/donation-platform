'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainLayout } from '@/components/layouts/MainLayout'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import requestsService, { RequestEvent } from '@/lib/api/requests'
import { HowDonationHelps } from '@/components/donations/HowDonationHelps'

export default function RequestDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = parseInt(params.id as string)
  const [request, setRequest] = useState<RequestEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const res = await requestsService.getRequestById(requestId)
        setRequest(res.data)
      } catch (error) {
        console.error('Error loading request:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRequest()
  }, [requestId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainLayout>
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-lg text-muted-foreground">Loading request details...</p>
              </div>
            </div>
          </main>
        </MainLayout>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <MainLayout>
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Request Not Found</h1>
              <p className="text-muted-foreground mb-6">The request you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/requests')} className="bg-red-500 hover:bg-red-600 text-white">
                Back to Requests
              </Button>
            </div>
          </main>
        </MainLayout>
      </div>
    )
  }

  const currentAmount = request.current_amount
  const goalAmount = request.goal_amount
  const progressPercentage = (currentAmount / goalAmount) * 100

  const handleDonateClick = () => {
    router.push(`/donate/${requestId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <MainLayout>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="mb-4 md:mb-6">
            <Button 
              onClick={() => router.back()}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Request Details</h1>
          </div>

          <div className="bg-card rounded-lg shadow-sm border p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className="relative mr-3 md:mr-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
                    <AvatarImage src={request.user.avatar_url || "/placeholder.svg"} alt={request.user.username} />
                    <AvatarFallback className="text-sm md:text-lg">
                      {request.user.first_name.charAt(0) + request.user.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
                    {request.user.first_name} {request.user.last_name}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {request.location?.district || 'Unknown'} • {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-2">{request.title}</h3>
            </div>

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
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-500 dark:text-red-400">${currentAmount.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Raised so far</p>
                </div>
                <div className="bg-muted rounded-lg p-2 sm:p-4">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">${goalAmount.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Goal amount</p>
                </div>
              </div>
            </div>

            {request.image_urls?.[0] && (
              <div className="mb-4 md:mb-6 w-full aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={request.image_urls[0]}
                  alt={request.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                  priority
                />
              </div>
            )}

            <div className="mb-6 md:mb-8">
              <h4 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">About this request</h4>
              <p className="text-sm sm:text-base text-card-foreground leading-relaxed whitespace-pre-line">
                {request.description}
              </p>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleDonateClick}
                className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg"
              >
                Donate Now
              </Button>
            </div>
          </div>

          <div className="mt-6 md:mt-8">
            <HowDonationHelps />
          </div>
        </main>
      </MainLayout>
    </div>
  )
}
