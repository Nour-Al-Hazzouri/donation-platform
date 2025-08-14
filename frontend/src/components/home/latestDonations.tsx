'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react'
import { cn } from '@/utils'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useDonationsStore, DonationData } from '@/store/donationsStore'

interface DonationItem extends Omit<DonationData, 'location'> {
  location: string
  timeAgo: string
  isAvailable: boolean
  quantity?: number
}

interface LatestDonationsProps {
  className?: string
}



const DonationCard: React.FC<{ donation: DonationItem }> = ({ donation }) => {
  const router = useRouter();
  return (
    <Card 
      className="flex-shrink-0 w-full h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] mx-1 sm:mx-2 flex flex-col bg-background cursor-pointer"
      onClick={() => donation.isAvailable && router.push(`/donations/${donation.id}`)}
    >
      <CardContent className="p-4 sm:p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="relative">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src={donation.avatarUrl || undefined} alt={donation.name} />
              <AvatarFallback className="bg-red-500 text-white text-xs sm:text-sm">
                {donation.initials}
              </AvatarFallback>
            </Avatar>
            {donation.isVerified && (
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
            {donation.name}
          </span>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
            {donation.title} ({donation.quantity} available)
          </h3>
          
          {donation.imageUrl && (
            <div className="w-full h-32 sm:h-40 relative rounded-md overflow-hidden">
              <Image 
                src={donation.imageUrl} 
                alt={donation.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          
          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3">
            {donation.description}
          </p>
          
          <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
            <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            <span>{donation.location} • {donation.timeAgo}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            className={`w-full text-sm sm:text-base ${donation.isAvailable ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-secondary text-secondary-foreground'}`}
            variant={donation.isAvailable ? "default" : "secondary"}
            disabled={!donation.isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              donation.isAvailable && router.push(`/donations/${donation.id}`);
            }}
          >
            {donation.isAvailable ? "Request" : "Unavailable"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const LatestDonations: React.FC<LatestDonationsProps> = ({ className }) => {
  const router = useRouter();
  const { getDonationOffers } = useDonationsStore()
  const [donations, setDonations] = useState<DonationItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationData = await getDonationOffers()
        
        // Transform API data to match DonationItem interface
        const transformedDonations: DonationItem[] = donationData.map((donation, index) => ({
          ...donation,
          quantity: donation.possibleAmount ? Math.floor(donation.possibleAmount) : 0,
          location: donation.location?.district || 'Unknown',
          timeAgo: getTimeAgo(donation.createdAt || ''),
          isAvailable: donation.status === 'active' && (donation.possibleAmount || 0) > 0
        }))
        
        setDonations(transformedDonations)
      } catch (error) {
        console.error('Error fetching donations:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDonations()
  }, [])
  
  // Helper function to calculate time ago
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return `${diffMins}m ago`
  }

  // Clone the first few items to create infinite loop effect
  const extendedDonations = donations.length > 0 
    ? [...donations, ...donations.slice(0, visibleCards)]
    : []

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
    if (donations.length === 0) return
    
    setIsTransitioning(true)
    setCurrentIndex(prev => {
      const newIndex = prev - 1
      return newIndex < 0 ? donations.length - 1 : newIndex
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const scrollRight = () => {
    if (donations.length === 0) return
    
    setIsTransitioning(true)
    setCurrentIndex(prev => {
      const newIndex = prev + 1
      return newIndex >= donations.length ? 0 : newIndex
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
            Latest Donations
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No donations available at the moment.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-center">
              <Button
                onClick={scrollLeft}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md mr-1 sm:mr-2 z-10 flex items-center justify-center transition-colors"
                aria-label="Previous donations"
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
                  {extendedDonations.map((donation, index) => (
                    <div
                      key={`${donation.id}-${index}`}
                      className="flex-shrink-0 px-1 sm:px-2"
                      style={{ width: `${100 / visibleCards}%` }}
                    >
                      <div className="h-full pb-4">
                        <DonationCard donation={donation} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={scrollRight}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md ml-1 sm:ml-2 z-10 flex items-center justify-center transition-colors"
                aria-label="Next donations"
              >
                <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6 sm:mt-8">
          <Button 
            className="transition-colors duration-200 rounded-full px-6 py-1.5 sm:px-8 sm:py-2 text-xs sm:text-sm lg:text-base bg-red-500 text-white hover:bg-red-600"
            onClick={() => router.push('/donations')}
          >
            View All Donations
          </Button>
        </div>
      </div>
    </section>
  )
}

export default LatestDonations