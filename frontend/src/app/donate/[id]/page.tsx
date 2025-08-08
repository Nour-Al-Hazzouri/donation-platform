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

// More robust helper to parse amounts, handling various types and ensuring a number is returned
const parseAmount = (value: string | number | undefined | null): number => {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = parseFloat(value.replace(/[^0-9.-]+/g,""));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export default function DonatePage() {
  // ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP LEVEL
  const params = useParams()
  const router = useRouter()
  const { requests, initializeRequests, updateRequestCurrentAmount } = useRequestsStore()
  const { isAuthenticated, user } = useAuthStore()
  const { deductBalance } = useAuthStore()
  const { openModal } = useModal()
  
  const [donationAmount, setDonationAmount] = useState([0])
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [donationError, setDonationError] = useState<string | null>(null)

  // All useEffects must also be unconditional
  useEffect(() => {
    initializeRequests(initialRequestsData)
  }, [initializeRequests])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      openModal('signIn')
    }
  }, [isAuthenticated, router, openModal])

  // Retrieve request data after hooks are called
  const requestId = parseInt(params.id as string)
  const request = requests.find(req => req.id === requestId)

  // Calculate amounts and maxDonationAllowed *before* any conditional returns that render different JSX
  const requestGoalAmount = parseAmount(request?.goalAmount) // Use optional chaining
  const requestCurrentAmount = parseAmount(request?.currentAmount) // Use optional chaining
  const remainingAmountNeeded = requestGoalAmount - requestCurrentAmount

  const userBalance = user?.balance || 0
  const maxDonationAllowed = Math.floor(Math.min(remainingAmountNeeded, userBalance))

  // THIS useEffect is now called unconditionally
  useEffect(() => {
    if (maxDonationAllowed > 0 && donationAmount[0] === 0) {
      setDonationAmount([Math.min(50, maxDonationAllowed)])
    }
  }, [maxDonationAllowed, donationAmount]) // Dependencies are correct

  // Conditional returns come AFTER all hooks are called.
  if (!isAuthenticated) {
    // This return is fine because the useEffect above already triggered the redirect.
    // The component will unmount or redirect before rendering further.
    return null 
  }

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

  const handleSliderChange = (value: number[]) => {
    setDonationAmount(value)
    setIsCustom(false)
    setCustomAmount('')
    setDonationError(null)
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setIsCustom(true)
    setDonationError(null)
    if (value && !isNaN(Number(value))) {
      setDonationAmount([Number(value)])
    } else {
      setDonationAmount([0])
    }
  }

  const handleDonate = async () => {
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }

    const finalAmount = isCustom ? Number(customAmount) : donationAmount[0]

    if (finalAmount <= 0) {
      setDonationError('Please enter a valid donation amount.')
      return
    }
    if (finalAmount > maxDonationAllowed) {
      setDonationError(`You can only donate up to $${maxDonationAllowed.toLocaleString()} (remaining needed: $${remainingAmountNeeded.toLocaleString()}, your balance: $${userBalance.toLocaleString()}).`)
      return
    }
    if (finalAmount > userBalance) {
      setDonationError(`You do not have enough balance. Your current balance is $${userBalance.toLocaleString()}.`)
      return
    }
    if (finalAmount > remainingAmountNeeded) {
      setDonationError(`This request only needs $${remainingAmountNeeded.toLocaleString()} more.`)
      return
    }

    setIsProcessing(true)
    setDonationError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      deductBalance(finalAmount)
      updateRequestCurrentAmount(requestId, finalAmount)
      
      console.log('Donation processed:', {
        requestId,
        amount: finalAmount,
        requestTitle: request.title
      })
      
      router.push(`/donate/success?amount=${finalAmount}&requestId=${requestId}`)
    } catch (error) {
      console.error('Donation failed:', error)
      setDonationError('Donation failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const displayAmount = isCustom ? (Number(customAmount) || 0) : donationAmount[0]

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
              <span className="font-medium">Request amount:</span> ${requestGoalAmount.toLocaleString()}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Current amount:</span> ${requestCurrentAmount.toLocaleString()}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Remaining needed:</span> ${remainingAmountNeeded.toLocaleString()}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Your balance:</span> ${userBalance.toLocaleString()}
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
                Amount: ${displayAmount.toLocaleString()}
              </Label>
              <span className="text-sm text-gray-500">Max: ${maxDonationAllowed.toLocaleString()}</span>
            </div>
            
            <Slider
              value={donationAmount}
              onValueChange={handleSliderChange}
              max={maxDonationAllowed > 0 ? maxDonationAllowed : 1}
              min={1}
              step={1}
              className="w-full"
              disabled={maxDonationAllowed <= 0}
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>$1</span>
              <span>${maxDonationAllowed.toLocaleString()}</span>
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
              max={maxDonationAllowed}
              disabled={maxDonationAllowed <= 0}
            />
          </div>

          {/* Preset Amount Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[10, 25, 50, 100].map((amount) => (
              <Button
                key={amount}
                variant={displayAmount === amount && !isCustom ? "default" : "outline"}
                onClick={() => {
                  setDonationAmount([amount])
                  setIsCustom(false)
                  setCustomAmount('')
                  setDonationError(null)
                }}
                className="text-sm"
                disabled={amount > maxDonationAllowed || maxDonationAllowed <= 0}
              >
                ${amount}
              </Button>
            ))}
          </div>

          {/* Donation Error Message */}
          {donationError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{donationError}</span>
            </div>
          )}

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={isProcessing || displayAmount <= 0 || displayAmount > maxDonationAllowed || maxDonationAllowed <= 0}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-medium"
          >
            {isProcessing ? 'Processing...' : `Donate $${displayAmount.toLocaleString()}`}
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
