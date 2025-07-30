'use client'

import { useState } from 'react'
import Image from "next/image"
import { ChevronLeft, ChevronRight, Facebook, Twitter, Instagram } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Team member data - easily editable to add/remove members
const teamMembers = [
  {
    id: 1,
    name: "Brycen Gregory",
    role: "Volunteer",
    image: "/donation1.png",
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
    image: "/donation2.jpg",
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
    image: "/donation3.jpg",
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
    image: "/donation4.jpg",
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
    image: "/aboutUs1.png",
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
    image: "/donation1.png",
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
    image: "/donation2.jpg",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#"
    }
  }
]

export default function TeamSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const membersPerSlide = 3
  const totalSlides = Math.ceil(teamMembers.length / membersPerSlide)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }

  const getCurrentSlideMembers = () => {
    const startIndex = currentSlide * membersPerSlide
    return teamMembers.slice(startIndex, startIndex + membersPerSlide)
  }

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
          {/* Navigation Arrows - Visible on all devices but styled differently */}
          <Button
            onClick={prevSlide}
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0 md:-translate-x-4 z-10 flex w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-[#f90404] text-[#f90404] hover:bg-[#f90404] hover:text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} className="md:w-5 md:h-5" />
          </Button>

          <Button
            onClick={nextSlide}
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0 md:translate-x-4 z-10 flex w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-[#f90404] text-[#f90404] hover:bg-[#f90404] hover:text-white"
            aria-label="Next slide"
          >
            <ChevronRight size={16} className="md:w-5 md:h-5" />
          </Button>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 justify-items-center">
            {getCurrentSlideMembers().map((member) => (
              <div key={member.id} className="text-center space-y-4 w-full max-w-xs mx-auto">
                {/* Profile Image */}
                <div className="relative w-full sm:w-56 md:w-64 h-72 sm:h-80 mx-auto mb-6">
                  <div className="w-full h-full bg-[#f5f5f5] rounded-t-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
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
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-[#f90404]' : 'bg-[#d9d9d9]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}