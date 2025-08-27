'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from '@/utils'

// Team member data - easily editable to add/remove members
const teamMembers = [
  {
    id: 1,
    name: "Nour Al Hazzouri",
    role: "Team Leader, Front-end Developer",
    image: "/team.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  },
  {
    id: 2,
    name: "Mariam Kanj",
    role: "UI/UX Designer, Front-end Developer",
    image: "/team-fem.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  },
  {
    id: 3,
    name: "Ali Atat",
    role: "Front-end Developer",
    image: "/team.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  },
  {
    id: 4,
    name: "Ayman DanDan",
    role: "Back-end Developer",
    image: "/team.png",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  },
  {
    id: 5,
    name: "Mouhamad Moussa",
    role: "Back-end Developer",
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
    <div className="text-center space-y-3 w-full h-full px-2 py-3 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] rounded-lg">
      {/* Profile Image - Removed grey background */}
      <div className="relative w-full h-56 sm:h-60 md:h-64 mx-auto mb-4">
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
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-bold text-foreground truncate px-2">
          {member.name}
        </h3>
        <p className="text-red-500 font-medium text-sm sm:text-base line-clamp-2 px-2">
          {member.role}
        </p>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-3 pt-1">
        <a
          href={member.social.facebook}
          className="text-muted-foreground hover:text-red-500 transition-colors"
          aria-label={`${member.name}'s Facebook`}
        >
          <Facebook size={18} />
        </a>
        <a
          href={member.social.twitter}
          className="text-muted-foreground hover:text-red-500 transition-colors"
          aria-label={`${member.name}'s Twitter`}
        >
          <Twitter size={18} />
        </a>
        <a
          href={member.social.instagram}
          className="text-muted-foreground hover:text-red-500 transition-colors"
          aria-label={`${member.name}'s Instagram`}
        >
          <Instagram size={18} />
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
      } else if (window.innerWidth < 1280) { // lg
        setVisibleCards(2)
      } else { // xl+
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
    <section className="bg-background py-12 sm:py-16 px-4 md:px-8 lg:px-16 mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Team
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="flex items-center justify-center">
            <Button
              onClick={scrollLeft}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md mr-1 sm:mr-2 z-10 flex items-center justify-center transition-colors"
              aria-label="Previous team members"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="overflow-hidden w-full max-w-6xl h-auto min-h-[380px]">
              <div
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
              >
                {extendedMembers.map((member, index) => (
                  <div
                    key={`${member.id}-${index}`}
                    className="flex-shrink-0 px-1 sm:px-2 h-full flex items-start"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <TeamCard member={member} />
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={scrollRight}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md ml-1 sm:ml-2 z-10 flex items-center justify-center transition-colors"
              aria-label="Next team members"
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
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
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