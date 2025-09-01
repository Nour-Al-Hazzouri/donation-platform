'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react'
import { cn } from '@/utils'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { initialDonationsData } from '@/store/donationsStore'

interface RequestItem {
  id: number
  name: string
  title: string
  description: string
  imageUrl?: string
  avatarUrl?: string
  initials: string
  isVerified: boolean
  location: string
  timeAgo: string
  isAvailable: boolean
  quantity?: number
}

interface LatestRequestsProps {
  className?: string
}

// Generate deterministic quantities based on request ID
const mockRequests: RequestItem[] = initialDonationsData.map((request, index) => ({
  ...request,
  userId: `user${request.id}`,
  userName: request.name,
  userAvatar: request.avatarUrl,
  itemName: request.title,
  quantity: (request.id % 20) + 5, // Deterministic quantity between 5-24 based on ID
  location: ['Tripoli', 'Beirut', 'Sidon', 'Tyre', 'Baalbek'][index % 5],
  timeAgo: `${index + 1}h ago`,
  isAvailable: true
}))

const RequestCard: React.FC<{ request: RequestItem }> = ({ request }) => {
  const router = useRouter();
  return (
    <Card 
      className="flex-shrink-0 w-full h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] mx-1 sm:mx-2 flex flex-col bg-background cursor-pointer"
      onClick={() => request.isAvailable && router.push(`/requests/${request.id}`)}
    >
      <CardContent className="p-4 sm:p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="relative">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              {request.avatarUrl ? (
                <AvatarImage src={request.avatarUrl || undefined} alt={request.name} />
              ) : (
                <AvatarFallback className="bg-red-500 text-white text-xs sm:text-sm">
                  {request.initials}
                </AvatarFallback>
              )}
            </Avatar>
            {request.isVerified && (
              <div className="absolute -top-1 -right-1">
                <Image 
                  src="/verification.png" 
                  alt="Verified" 
                  width={16}
                  height={16}
                  className="rounded-full border border-white"
                />
              </div>
            )}
          </div>
          <span className="text-foreground font-medium text-sm sm:text-base">
            {request.name}
          </span>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
            {request.title} ({request.quantity} needed)
          </h3>
          
          {request.imageUrl && (
            <div className="w-full h-32 sm:h-40 relative rounded-md overflow-hidden">
              <Image 
                src={request.imageUrl} 
                alt={request.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          
          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3">
            {request.description}
          </p>
          
          <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
            <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            <span>{request.location} • {request.timeAgo}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            className={`w-full text-sm sm:text-base ${request.isAvailable ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-secondary text-secondary-foreground'}`}
            variant={request.isAvailable ? "default" : "secondary"}
            disabled={!request.isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              request.isAvailable && router.push(`/donate/${request.id}`);
            }}
          >
            {request.isAvailable ? "Donate" : "Fulfilled"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const LatestRequests: React.FC<LatestRequestsProps> = ({ className }) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [visibleCards, setVisibleCards] = React.useState(3)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  // Clone the first few items to create infinite loop effect
  const extendedRequests = [...mockRequests, ...mockRequests.slice(0, visibleCards)]

  React.useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const updateVisibleCards = () => {
        if (window.innerWidth < 640) { // xs
          setVisibleCards(1)
        } else if (window.innerWidth < 768) { // sm
          setVisibleCards(1)
        } else if (window.innerWidth < 1024) { // md
          setVisibleCards(2)
        } else { // lg+
          setVisibleCards(3)
        }
      }

      updateVisibleCards()
      window.addEventListener('resize', updateVisibleCards)
      return () => window.removeEventListener('resize', updateVisibleCards)
    }
  }, [])

  const scrollLeft = () => {
    setIsTransitioning(true)
    setCurrentIndex(prev => {
      const newIndex = prev - 1
      return newIndex < 0 ? mockRequests.length - 1 : newIndex
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const scrollRight = () => {
    setIsTransitioning(true)
    setCurrentIndex(prev => {
      const newIndex = prev + 1
      return newIndex >= mockRequests.length ? 0 : newIndex
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Auto-scroll every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        scrollRight()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [isTransitioning])

  return (
    <section className={cn("py-8 sm:py-12", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center">
            Latest Requests
          </h2>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center">
            <Button
              onClick={scrollLeft}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md mr-1 sm:mr-2 z-10 flex items-center justify-center transition-colors"
              aria-label="Previous requests"
            >
              <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="overflow-hidden w-full max-w-6xl">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
              >
                {extendedRequests.map((request, index) => (
                  <div
                    key={`${request.id}-${index}`}
                    className="flex-shrink-0 px-1 sm:px-2"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <div className="h-full pb-4">
                      <RequestCard request={request} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={scrollRight}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md ml-1 sm:ml-2 z-10 flex items-center justify-center transition-colors"
              aria-label="Next requests"
            >
              <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8">
          <Button 
            className="transition-colors duration-200 rounded-full px-6 py-1.5 sm:px-8 sm:py-2 text-xs sm:text-sm lg:text-base bg-red-500 text-white hover:bg-red-600"
            onClick={() => router.push('/requests')}
          >
            View All Requests
          </Button>
        </div>
      </div>
    </section>
  )
}

export default LatestRequests