'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { requestsData } from "@/components/requests/RequestCards"
import { MainLayout } from '@/components/layouts/MainLayout'

export default function RequestDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const requestId = parseInt(params.id as string)
  
  // Find the request by ID
  const request = requestsData.find(req => req.id === requestId)
  
if (!request) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainLayout>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Request Not Found</h1>
            <p className="text-gray-600 mb-6">The request you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/')} className="bg-red-500 hover:bg-red-600 text-white">
              Back to Requests
            </Button>
          </div>
        </main>
      </MainLayout>
    </div>
  )
}


  // Mock data for request details (in real app, this would come from API)
  const requestDetails = {
    ...request,
    requestAmount: request.title.includes('cancer') ? '50,000' : 
                   request.title.includes('heart') ? '75,000' :
                   request.title.includes('survive') ? '25,000' :
                   request.title.includes('medical') ? '30,000' :
                   request.title.includes('fire') ? '15,000' : '10,000',
    currentAmount: request.title.includes('cancer') ? '12,500' : 
                   request.title.includes('heart') ? '23,000' :
                   request.title.includes('survive') ? '8,750' :
                   request.title.includes('medical') ? '5,200' :
                   request.title.includes('fire') ? '3,800' : '2,100',
    currency: '$',
    fullDescription: request.description + ' ' + 
      'We are reaching out to our community for support during this difficult time. Every contribution, no matter how small, brings us closer to our goal and gives us hope for a better tomorrow. Your kindness and generosity mean everything to us.',
    dateCreated: '2 days ago',
    location: 'Lebanon',
    category: request.title.includes('cancer') || request.title.includes('heart') || request.title.includes('medical') ? 'Medical' :
              request.title.includes('fire') ? 'Emergency' :
              request.title.includes('education') ? 'Education' : 'General'
  }

  const progressPercentage = (parseFloat(requestDetails.currentAmount.replace(',', '')) / parseFloat(requestDetails.requestAmount.replace(',', ''))) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <MainLayout>
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 p-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Request Details</h1>
        </div>

        {/* Request Details Card */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* User Profile Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src={request.avatarUrl || "/placeholder.svg"} alt={request.name} />
                <AvatarFallback className="text-lg">{request.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold text-gray-900">{request.name}</h2>
                  {request.isVerified && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      ✓
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{requestDetails.location} • {requestDetails.dateCreated}</p>
                <Badge variant="outline" className="mt-1">
                  {requestDetails.category}
                </Badge>
              </div>
            </div>
            <Button variant="destructive" size="sm">
              Report
            </Button>
          </div>

          {/* Request Title */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{request.title}</h3>
          </div>

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-red-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-500">{requestDetails.currency}{requestDetails.currentAmount}</p>
                <p className="text-sm text-gray-600">Raised so far</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{requestDetails.currency}{requestDetails.requestAmount}</p>
                <p className="text-sm text-gray-600">Goal amount</p>
              </div>
            </div>
          </div>

          {/* Request Image */}
          {request.imageUrl && (
            <div className="mb-6">
              <img 
                src={request.imageUrl || "/placeholder.svg"} 
                alt={request.title}
                className="w-full max-w-md mx-auto h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Full Description */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">About this request</h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {requestDetails.fullDescription}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg">
              Donate Now
            </Button>
            <Button variant="outline" className="px-8 py-3 text-lg">
              Share Request
            </Button>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">How your donation helps</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-500 mb-2">100%</div>
              <p className="text-sm text-gray-600">of donations go directly to the cause</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-500 mb-2">24/7</div>
              <p className="text-sm text-gray-600">Support and updates on progress</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-500 mb-2">Secure</div>
              <p className="text-sm text-gray-600">Safe and encrypted transactions</p>
            </div>
          </div>
        </div>
      </main>
      </MainLayout>
    </div>
  )
}
