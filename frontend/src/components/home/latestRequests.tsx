'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COLORS } from '@/lib/constants'

interface RequestItem {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  itemName: string
  quantity: number
  location: string
  timeAgo: string
  isAvailable: boolean
}

interface LatestRequestsProps {
  className?: string
}

const mockRequests: RequestItem[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'User1',
    userAvatar: '',
    itemName: 'Winter Blankets',
    quantity: 20,
    location: 'Tripoli',
    timeAgo: '1h ago',
    isAvailable: true,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'User2',
    userAvatar: '',
    itemName: 'Food Packages',
    quantity: 15,
    location: 'Beirut',
    timeAgo: '2h ago',
    isAvailable: true,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'User3',
    userAvatar: '',
    itemName: 'Medical Supplies',
    quantity: 8,
    location: 'Sidon',
    timeAgo: '3h ago',
    isAvailable: true,
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'User4',
    userAvatar: '',
    itemName: 'Clothing',
    quantity: 30,
    location: 'Tyre',
    timeAgo: '4h ago',
    isAvailable: true,
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'User5',
    userAvatar: '',
    itemName: 'Hygiene Kits',
    quantity: 12,
    location: 'Baalbek',
    timeAgo: '5h ago',
    isAvailable: true,
  },
]

const RequestCard: React.FC<{ request: RequestItem }> = ({ request }) => {
  return (
    <Card className="flex-shrink-0 w-full h-full hover:shadow-lg transition-shadow duration-200 mx-1 sm:mx-2 flex flex-col bg-white">
      <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={request.userAvatar || undefined} alt={request.userName} />
            <AvatarFallback className="bg-[#f90404] text-white text-xs sm:text-sm">
              {request.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-foreground font-medium text-sm sm:text-base">
            {request.userName}
          </span>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-1">
          <h3 className="font-semibold text-base sm:text-lg">
            {request.itemName} ({request.quantity} needed)
          </h3>
          
          <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
            <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-[#f90404]" />
            <span>{request.location} • {request.timeAgo}</span>
          </div>
        </div>

        <Button 
          className="w-full mt-auto text-sm sm:text-base"
          style={{
            backgroundColor: request.isAvailable ? COLORS.primary : '#f3f4f6',
            color: request.isAvailable ? 'white' : COLORS.text.secondary,
          }}
          variant={request.isAvailable ? "default" : "secondary"}
          disabled={!request.isAvailable}
        >
          {request.isAvailable ? "Donate" : "Fulfilled"}
        </Button>
      </CardContent>
    </Card>
  )
}

const LatestRequests: React.FC<LatestRequestsProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [visibleCards, setVisibleCards] = React.useState(3)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  // Clone the first few items to create infinite loop effect
  const extendedRequests = [...mockRequests, ...mockRequests.slice(0, visibleCards)]

  React.useEffect(() => {
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Latest Requests
          </h2>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md mr-1 sm:mr-2 z-10"
              )}
              onClick={scrollLeft}
              aria-label="Previous requests"
              style={{ color: COLORS.primary }}
            >
              <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="overflow-hidden w-full max-w-6xl" style={{ height: '300px sm:h-[340px]' }}>
              <div
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
              >
                {extendedRequests.map((request, index) => (
                  <div
                    key={`${request.id}-${index}`}
                    className="flex-shrink-0 px-1 sm:px-2 h-full"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <RequestCard request={request} />
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md ml-1 sm:ml-2 z-10"
              )}
              onClick={scrollRight}
              aria-label="Next requests"
              style={{ color: COLORS.primary }}
            >
              <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8">
          <Button 
            className="transition-colors duration-200 rounded-full px-6 py-1.5 sm:px-8 sm:py-2 text-xs sm:text-sm lg:text-base"
            style={{
              backgroundColor: COLORS.primary,
              color: 'white',
            }}
          >
            View All Requests
          </Button>
        </div>
      </div>
    </section>
  )
}

export default LatestRequests