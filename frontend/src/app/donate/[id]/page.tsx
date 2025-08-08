'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MainLayout } from '@/components/layouts/MainLayout'
import { useRequestsStore, initialRequestsData } from "@/lib/store/requestsStore"
import { useAuthStore } from '@/lib/store/authStore'
import { useModal } from '@/lib/contexts/ModalContext'

export default function DonatePage() {
  const params = useParams()
  const router = useRouter()
  const requestId = parseInt(params.id as string)
  const { requests, initializeRequests } = useRequestsStore()
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  
  const [donationAmount, setDonationAmount] = useState([50])
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Initialize requests store
  useEffect(() => {
    initializeRequests(initialRequestsData)
  }, [initializeRequests])

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      openModal('signIn')
    }
  }, [isAuthenticated, router, openModal])

  // Find the request by ID
  const request = requests.find(req => req.id === requestId)

  if (!request) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Request Not Found</h1>
            <p className="text-gray-600 mb-6">The request you're trying to donate to doesn't exist.</p>
            <Button onClick={() => router.push('/')} className="bg-red-500 hover:bg-red-600 text-white">
              Back to Requests
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Get request amounts
  const getRequestAmount = (request: any) => {
    if (request.goalAmount) {
      return request.goalAmount
    }
    if (request.title.includes('cancer')) return '50,000'
    if (request.title.includes('heart')) return '75,000'
    if (request.title.includes('survive')) return '25,000'
    if (request.title.includes('medical')) return '30,000'
    if (request.title.includes('fire')) return '15,000'
    return '10,000'
  }

  const getCurrentAmount = (request: any) => {
    const goalAmount = parseFloat(getRequestAmount(request).replace(',', ''))
    if (request.goalAmount) {
      const percentage = Math.random() * 0.2
      return Math.floor(goalAmount * percentage).toLocaleString()
    }
    if (request.title.includes('cancer')) return '12,500'
    if (request.title.includes('heart')) return '23,000'
    if (request.title.includes('survive')) return '8,750'
    if (request.title.includes('medical')) return '5,200'
    if (request.title.includes('fire')) return '3,800'
    return '2,100'
  }

  const requestAmount = getRequestAmount(request)
  const currentAmount = getCurrentAmount(request)
  const maxDonation = Math.min(1000, parseInt(requestAmount.replace(',', '')) / 10)

  const handleSliderChange = (value: number[]) => {
    setDonationAmount(value)
    setIsCustom(false)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setIsCustom(true)
    if (value && !isNaN(Number(value))) {
      setDonationAmount([Number(value)])
    }
  }

  const handleDonate = async () => {
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }

    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const finalAmount = isCustom ? Number(customAmount) : donationAmount[0]
      
      console.log('Donation processed:', {
        requestId,
        amount: finalAmount,
        requestTitle: request.title
      })
      
      // Redirect to success page
      router.push(`/donate/success?amount=${finalAmount}&requestId=${requestId}`)
    } catch (error) {
      console.error('Donation failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const finalAmount = isCustom ? Number(customAmount) || 0 : donationAmount[0]

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center text-white hover:text-white p-2 bg-red-500 hover:bg-red-600 rounded-full w-10 h-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Request Info Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Request Info</h2>
          
          <div className="space-y-2 mb-6">
            <p className="text-gray-700">
              <span className="font-medium">Request amount:</span> ${requestAmount}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Current amount:</span> ${currentAmount}
            </p>
          </div>

          {/* Request Title */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">{request.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
          </div>
        </div>

        {/* Donation Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Donate the amount you want</h2>
          
          {/* Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-sm font-medium text-gray-700">
                Amount: ${finalAmount}
              </Label>
              <span className="text-sm text-gray-500">Max: ${maxDonation}</span>
            </div>
            
            <Slider
              value={donationAmount}
              onValueChange={handleSliderChange}
              max={maxDonation}
              min={1}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>$1</span>
              <span>${maxDonation}</span>
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="mb-8">
            <Label htmlFor="custom-amount" className="text-sm font-medium text-gray-700 mb-2 block">
              Or enter a custom amount
            </Label>
            <Input
              id="custom-amount"
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="w-full"
              min="1"
            />
          </div>

          {/* Preset Amount Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[10, 25, 50, 100].map((amount) => (
              <Button
                key={amount}
                variant={donationAmount[0] === amount && !isCustom ? "default" : "outline"}
                onClick={() => {
                  setDonationAmount([amount])
                  setIsCustom(false)
                  setCustomAmount('')
                }}
                className="text-sm"
              >
                ${amount}
              </Button>
            ))}
          </div>

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={isProcessing || finalAmount <= 0}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-medium"
          >
            {isProcessing ? 'Processing...' : `Donate $${finalAmount}`}
          </Button>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Secure Donation</span>
            </div>
            <p className="text-xs text-gray-600">
              Your donation is secure and encrypted. 100% of your donation goes directly to the cause.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
