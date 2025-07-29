'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COLORS } from '@/lib/constants'

interface DonationItem {
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

interface LatestDonationsProps {
  className?: string
}

const mockDonations: DonationItem[] = [
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

const DonationCard: React.FC<{ donation: DonationItem }> = ({ donation }) => {
  return (
    <Card className="flex-shrink-0 w-full h-full hover:shadow-lg transition-shadow duration-200 mx-2 flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={donation.userAvatar || undefined} alt={donation.userName} />
            <AvatarFallback className="bg-[#f90404] text-white">
              {donation.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-foreground font-medium">{donation.userName}</span>
        </div>

        <div className="space-y-3 mb-4 flex-1">
          <h3 className="font-semibold text-lg">
            {donation.itemName} ({donation.quantity} available)
          </h3>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="h-4 w-4 text-[#f90404]" />
            <span className="text-sm">{donation.location} • {donation.timeAgo}</span>
          </div>
        </div>

        <Button 
          className="w-full mt-auto"
          style={{
            backgroundColor: donation.isAvailable ? COLORS.primary : '#f3f4f6',
            color: donation.isAvailable ? 'white' : COLORS.text.secondary,
          }}
          variant={donation.isAvailable ? "default" : "secondary"}
          disabled={!donation.isAvailable}
        >
          {donation.isAvailable ? "Request" : "Unavailable"}
        </Button>
      </CardContent>
    </Card>
  )
}

const LatestDonations: React.FC<LatestDonationsProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [visibleCards, setVisibleCards] = React.useState(3)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  // Clone the first few items to create infinite loop effect
  const extendedDonations = [...mockDonations, ...mockDonations.slice(0, visibleCards)]

  React.useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2)
      } else {
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
      return newIndex < 0 ? mockDonations.length - 1 : newIndex
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const scrollRight = () => {
    setIsTransitioning(true)
    setCurrentIndex(prev => {
      const newIndex = prev + 1
      return newIndex >= mockDonations.length ? 0 : newIndex
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
    <section className={cn("py-12 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Latest Donations
          </h2>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md mr-2 z-10"
              )}
              onClick={scrollLeft}
              aria-label="Previous donations"
              style={{ color: COLORS.primary }}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>

            <div className="overflow-hidden w-full max-w-6xl" style={{ height: '340px' }}>
              <div
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
              >
                {extendedDonations.map((donation, index) => (
                  <div
                    key={`${donation.id}-${index}`}
                    className="flex-shrink-0 px-2 h-full"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <DonationCard donation={donation} />
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md ml-2 z-10"
              )}
              onClick={scrollRight}
              aria-label="Next donations"
              style={{ color: COLORS.primary }}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button 
            className="transition-colors duration-200 rounded-full px-8 py-2 text-sm lg:text-base"
            style={{
              backgroundColor: COLORS.primary,
              color: 'white',
            }}
          >
            View All Donations
          </Button>
        </div>
      </div>
    </section>
  )
}

export default LatestDonations