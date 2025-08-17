'use client'

import { MainLayout } from "@/components/layouts/MainLayout";
import AboutIntroSection from '@/components/aboutUs/AboutIntroSection'
import AboutStatsSection from '@/components/aboutUs/AboutStatsSection'
import AboutMissionSection from '@/components/aboutUs/AboutMissionSection'
import AboutOrganizationSection from '@/components/aboutUs/AboutOrganizationSection'
import TeamSection from '@/components/aboutUs/TeamSection'

export default function AboutClient() {
  return (
    <MainLayout>
      <div className="flex-grow">
        {/* 1. Intro Section without button */}
        <AboutIntroSection showButton={false} />
        
        {/* Visual separator */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
          <div className="w-full h-px bg-gray-200"></div>
        </div>
        
        {/* 2. Stats Section */}
        <AboutStatsSection />
        
        {/* Visual separator */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
          <div className="w-full h-px bg-gray-200"></div>
        </div>
        
        {/* 3. Mission Section */}
        <AboutMissionSection />
        
        {/* Visual separator */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
          <div className="w-full h-px bg-gray-200"></div>
        </div>
        
        {/* 4. Organization Section */}
        <AboutOrganizationSection />
        
        {/* Visual separator */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-12">
          <div className="w-full h-px bg-gray-200"></div>
        </div>
        
        {/* 5. Team Section */}
        <TeamSection />
      </div>
    </MainLayout>
  )
}