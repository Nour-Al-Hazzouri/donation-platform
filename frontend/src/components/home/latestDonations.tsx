'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react'
import { cn } from '@/utils'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useDonationsStore, DonationData } from '@/store/donationsStore'
import router from 'next/router'

interface DonationItem extends Omit<DonationData, 'location'> {
  location: string
  timeAgo: string
  quantity?: number
}

interface LatestDonationsProps {
  className?: string
}

const DonationCard: React.FC<{ donation: DonationItem }> = ({ donation }) => {
  const router = useRouter()

  const imageSrc = donation.imageUrl
    ? donation.imageUrl.startsWith('http')
      ? donation.imageUrl
      : `${process.env.NEXT_PUBLIC_API_URL || ''}/${donation.imageUrl.replace(/^\/?/, '')}`
    : undefined

  return (
    <Card
      className="flex-shrink-0 w-full h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] mx-1 sm:mx-2 flex flex-col bg-background cursor-pointer"
      onClick={() => router.push(`/donations/${donation.id}`)}
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
          </div>
          <span className="text-foreground font-medium text-sm sm:text-base">{donation.name}</span>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
            {donation.title} ({donation.quantity})
          </h3>

          {imageSrc && (
            <div className="w-full h-32 sm:h-40 relative rounded-md overflow-hidden">
              <Image
                src={imageSrc}
                alt={donation.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3">{donation.description}</p>

          <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
            <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            <span>
              {donation.location} • {donation.timeAgo}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            className="w-full text-sm sm:text-base bg-red-500 text-white hover:bg-red-600"
            variant="default"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/donations/${donation.id}`)
            }}
          >
            Request
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const LatestDonations: React.FC<LatestDonationsProps> = ({ className }) => {
  const { getDonationOffers } = useDonationsStore()
  const [donations, setDonations] = React.useState<DonationItem[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [visibleCards, setVisibleCards] = React.useState(3)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  React.useEffect(() => {
    const fetchDonations = async () => {
      const donationData = await getDonationOffers()
      const transformed: DonationItem[] = donationData.map((donation) => ({
        ...donation,
        quantity: donation.possibleAmount ? Math.floor(donation.possibleAmount) : 0,
        location: donation.location?.district || 'Unknown',
        timeAgo: 'Just now',
      }))
      setDonations(transformed)
    }
    fetchDonations()
  }, [getDonationOffers])

  const extendedDonations = [...donations, ...donations.slice(0, visibleCards)]

  React.useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) setVisibleCards(1)
      else if (window.innerWidth < 768) setVisibleCards(1)
      else if (window.innerWidth < 1024) setVisibleCards(2)
      else setVisibleCards(3)
    }
    updateVisibleCards()
    window.addEventListener('resize', updateVisibleCards)
    return () => window.removeEventListener('resize', updateVisibleCards)
  }, [])

  const scrollLeft = () => {
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 < 0 ? donations.length - 1 : prev - 1))
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const scrollRight = () => {
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1 >= donations.length ? 0 : prev + 1))
    setTimeout(() => setIsTransitioning(false), 300)
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) scrollRight()
    }, 5000)
    return () => clearInterval(interval)
  }, [isTransitioning])

  return (
    <section className={cn('py-8 sm:py-12', className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center">
            Latest Donations
          </h2>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No donations available at the moment.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-center">
              <Button
                onClick={scrollLeft}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md mr-2 z-10 flex items-center justify-center"
              >
                <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <div className="overflow-hidden w-full max-w-6xl">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
                >
                  {extendedDonations.map((donation, index) => (
                    <div key={`${donation.id}-${index}`} className="flex-shrink-0 px-1 sm:px-2" style={{ width: `${100 / visibleCards}%` }}>
                      <div className="h-full pb-4">
                        <DonationCard donation={donation} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={scrollRight}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md ml-2 z-10 flex items-center justify-center"
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
