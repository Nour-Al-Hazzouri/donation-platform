'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from '@/components/layouts/MainLayout'
import { donationsData } from "@/components/donations/DonationCards"
import { useAuthStore } from '@/lib/store/authStore'
import { useModal } from '@/lib/contexts/ModalContext'
import Image from 'next/image'

export default function DonationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const donationId = parseInt(params.id as string)
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  
  // Find the donation by ID
  const donation = donationsData.find(donation => donation.id === donationId)
  
  if (!donation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainLayout>
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Donation Not Found</h1>
              <p className="text-gray-600 mb-6">The donation you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/donations')} className="bg-red-500 hover:bg-red-600 text-white">
                Back to Donations
              </Button>
            </div>
          </main>
        </MainLayout>
      </div>
    )
  }

  // Mock data for donation details
  const donationDetails = {
    ...donation,
    donationAmount: donation.title.includes('cancer') ? '50,000' : 
                   donation.title.includes('heart') ? '75,000' :
                   donation.title.includes('lifelong') ? '25,000' :
                   donation.title.includes('medical') ? '30,000' :
                   donation.title.includes('disaster') ? '15,000' : '10,000',
    currentAmount: donation.title.includes('cancer') ? '12,500' : 
                   donation.title.includes('heart') ? '23,000' :
                   donation.title.includes('lifelong') ? '8,750' :
                   donation.title.includes('medical') ? '5,200' :
                   donation.title.includes('disaster') ? '3,800' : '2,100',
    currency: '$',
    fullDescription: donation.description + ' ' + 
      'This donation offer is available to those in genuine need. We carefully review all requests to ensure the funds go to those who need them most. Please provide detailed information about your situation when making a request.',
    dateCreated: '2 days ago',
    location: 'Lebanon'
  }

  const progressPercentage = (parseFloat(donationDetails.currentAmount.replace(',', '')) / parseFloat(donationDetails.donationAmount.replace(',', ''))) * 100

  const handleRequest = () => {
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }
    router.push(`/request/${donationId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainLayout>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Back Button */}
          <div className="mb-4 md:mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white/90 shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Donation Details</h1>
          </div>

          {/* Donation Details Card */}
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-8">
            {/* User Profile Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className="relative mr-3 md:mr-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
                    <AvatarImage src={donation.avatarUrl || "/placeholder.svg"} alt={donation.name} />
                    <AvatarFallback className="text-sm md:text-lg">{donation.initials}</AvatarFallback>
                  </Avatar>
                  {donation.isVerified && (
                    <div className="absolute -top-1 -right-1">
                      <Image 
                        src="/verification.png" 
                        alt="Verified" 
                        width={16} 
                        height={16}
                        className="rounded-full border-2 border-white"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1 md:gap-2 mb-1">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">{donation.name}</h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{donationDetails.location} • {donationDetails.dateCreated}</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="self-end sm:self-auto">
                Report
              </Button>
            </div>

            {/* Donation Title */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{donation.title}</h3>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Progress</span>
                <span className="text-xs sm:text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-3 sm:mb-4">
                <div 
                  className="bg-red-500 h-2 sm:h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-500">{donationDetails.currency}{donationDetails.currentAmount}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Distributed so far</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{donationDetails.currency}{donationDetails.donationAmount}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Total amount</p>
                </div>
              </div>
            </div>

            {/* Donation Image */}
            {donation.imageUrl && (
              <div className="mb-4 md:mb-6 w-full aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={donation.imageUrl || "/placeholder.svg"}
                  alt={donation.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                  priority
                />
              </div>
            )}

            {/* Full Description */}
            <div className="mb-6 md:mb-8">
              <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">About this donation</h4>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {donationDetails.fullDescription}
              </p>
            </div>

            {/* Request Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleRequest}
                className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg"
              >
                Request Now
              </Button>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm border p-4 md:p-6">
            <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">How to request this donation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-red-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-red-500 mb-1 md:mb-2">100%</div>
                <p className="text-xs sm:text-sm text-gray-600">of donations go directly to those in need</p>
              </div>
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-blue-500 mb-1 md:mb-2">24/7</div>
                <p className="text-xs sm:text-sm text-gray-600">Support and updates on progress</p>
              </div>
              <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-green-500 mb-1 md:mb-2">Secure</div>
                <p className="text-xs sm:text-sm text-gray-600">Safe and encrypted transactions</p>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  )
}