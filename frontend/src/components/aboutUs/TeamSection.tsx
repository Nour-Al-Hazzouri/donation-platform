'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

// Team member data - easily editable to add/remove members
const teamMembers = [
  {
    id: 1,
    name: "Brycen Gregory",
    role: "Volunteer",
    image: "/team.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Community Manager",
    image: "/team.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  },
  {
    id: 3,
    name: "Ahmed Hassan",
    role: "Operations Director",
    image: "/team.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    role: "Volunteer Coordinator",
    image: "/team.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  },
  {
    id: 5,
    name: "David Chen",
    role: "Technology Lead",
    image: "/team.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  },
  {
    id: 6,
    name: "Fatima Al-Zahra",
    role: "Outreach Specialist",
    image: "/team.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  },
  {
    id: 7,
    name: "Michael Thompson",
    role: "Finance Manager",
    image: "/team.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  }
]

const TeamCard = ({ member }: { member: typeof teamMembers[0] }) => {
  return (
    <div className="text-center space-y-4 w-full h-full px-2">
      {/* Profile Image - Removed grey background */}
      <div className="relative w-full h-64 sm:h-72 md:h-80 mx-auto mb-6">
        <div className="w-full h-full rounded-t-full overflow-hidden">
          <Image
            src={member.image}
            alt={`${member.name} - ${member.role}`}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Member Info */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-[#000000]">
          {member.name}
        </h3>
        <p className="text-[#f90404] font-medium">
          {member.role}
        </p>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-4 pt-2">
        <a
          href={member.social.facebook}
          className="text-[#5a5a5a] hover:text-[#f90404] transition-colors"
          aria-label={`${member.name}'s Facebook`}
        >
          <Facebook size={20} />
        </a>
        <a
          href={member.social.twitter}
          className="text-[#5a5a5a] hover:text-[#f90404] transition-colors"
          aria-label={`${member.name}'s Twitter`}
        >
          <Twitter size={20} />
        </a>
        <a
          href={member.social.instagram}
          className="text-[#5a5a5a] hover:text-[#f90404] transition-colors"
          aria-label={`${member.name}'s Instagram`}
        >
          <Instagram size={20} />
        </a>
      </div>
    </div>
  )
}

export default function TeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Clone the first few items to create infinite loop effect
  const extendedMembers = [...teamMembers, ...teamMembers.slice(0, visibleCards)]

  useEffect(() => {
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
      return newIndex < 0 ? teamMembers.length - 1 : newIndex
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const scrollRight = () => {
    setIsTransitioning(true)
    setCurrentIndex(prev => {
      const newIndex = prev + 1
      return newIndex >= teamMembers.length ? 0 : newIndex
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        scrollRight()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [isTransitioning])

  return (
    <section className="bg-white py-16 px-4 md:px-8 lg:px-16 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#000000]">
            Our Team
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md mr-1 sm:mr-2 z-10"
              )}
              onClick={scrollLeft}
              aria-label="Previous team members"
              style={{ color: '#f90404' }}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="overflow-hidden w-full max-w-6xl" style={{ height: '420px' }}>
              <div
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
              >
                {extendedMembers.map((member, index) => (
                  <div
                    key={`${member.id}-${index}`}
                    className="flex-shrink-0 px-1 sm:px-2 h-full"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <TeamCard member={member} />
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
              aria-label="Next team members"
              style={{ color: '#f90404' }}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: teamMembers.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#f90404]' : 'bg-[#d9d9d9]'
                }`}
                aria-label={`Go to team member ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}