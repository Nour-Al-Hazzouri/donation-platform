'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { COLORS } from "@/lib/constants"
import { Handshake, Users, Heart } from 'lucide-react'
import AboutUsSection from '@/components/aboutUs/AboutUsSection'
import AboutOrganizationSection from '@/components/aboutUs/AboutOrganizationSection'
import TeamSection from '@/components/aboutUs/TeamSection'

export default function AboutUs() {
  return (
    <section className="w-full bg-white py-12 px-4 md:px-8 lg:px-16" id="about-us">
      <div className="max-w-7xl mx-auto">
        {/* Centered Title and Intro */}
        <div className="w-full text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">About us</h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto mt-4">
            In the heart of Lebanon&apos;s toughest times, we saw neighbors helping neighbors – sharing bread, medicine, and hope. GiveLeb was born from these everyday acts of courage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                The Lebanese Way of Sharing
              </h3>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                At GiveLeb, we&apos;ve turned our tradition of neighborly care into a digital lifeline. Born in Lebanon during the darkest days of crisis, we connect those who can help with those who need it most – with dignity, speed, and zero bureaucracy.
              </p>
              <p className="text-sm text-gray-700 font-semibold">What Makes Us Different</p>
              <ul className="mt-2 space-y-4">
                <li className="flex items-start gap-3">
                  <Handshake className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Direct Aid: Your donation reaches hands, not warehouses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Community-Powered: Every post and need is verified by locals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">For All Lebanese: No sides, no sects, just humanity helping humanity.</span>
                </li>
              </ul>
            </div>

            <div className="flex md:justify-start justify-center">
              <Button
                className={`
                  mt-4 w-fit
                  bg-[${COLORS.primary}] text-white border-[${COLORS.primary}]
                  hover:bg-[${COLORS.primaryHover}] hover:text-white hover:border-[${COLORS.primaryHover}]
                  transition-colors duration-200 rounded-full px-6 text-base
                `}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Image Section - Improved */}
          <div className="flex justify-center md:justify-end">
            <div className="relative rounded-2xl overflow-hidden shadow-lg group w-full sm:w-4/5 md:w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-900/30 z-10"></div>
              <Image
                src="/aboutUs1.png"
                alt="Lebanese community sharing aid"
                width={600}
                height={500}
                className="rounded-2xl object-cover w-full h-auto transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
               
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual separator */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
        <div className="w-full h-px bg-gray-200"></div>
      </div>
      
      {/* Add the AboutUsSection component */}
      <AboutUsSection />
      
      {/* Visual separator */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
        <div className="w-full h-px bg-gray-200"></div>
      </div>
      
      {/* Add the AboutOrganizationSection component */}
      <AboutOrganizationSection />
      
      {/* Visual separator */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
        <div className="w-full h-px bg-gray-200"></div>
      </div>
      
      {/* Add the TeamSection component */}
      <TeamSection />
    </section>
  )
}