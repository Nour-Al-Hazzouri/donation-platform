'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MainLayout } from '@/components/layouts/MainLayout'
import { useRequestsStore, initialRequestsData } from "@/store/requestsStore"
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'

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
  const params = useParams()
  const router = useRouter()
  const { requests, initializeRequests, updateRequestCurrentAmount } = useRequestsStore()
  const { isAuthenticated, user } = useAuthStore()
  const { openModal } = useModal()
  
  const [donationAmount, setDonationAmount] = useState([0])
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [donationError, setDonationError] = useState<string | null>(null)

  useEffect(() => {
    initializeRequests(initialRequestsData)
  }, [initializeRequests])

  // We no longer automatically show the login modal on page load
  // Instead, we show a login prompt section and handle authentication checks on user interactions

  const requestId = parseInt(params.id as string)
  const request = requests.find(req => req.id === requestId)

  const requestGoalAmount = parseAmount(request?.goalAmount)
  const requestCurrentAmount = parseAmount(request?.currentAmount)
  const remainingAmountNeeded = requestGoalAmount - requestCurrentAmount

  useEffect(() => {
    if (remainingAmountNeeded > 0 && donationAmount[0] === 0) {
      setDonationAmount([Math.min(50, remainingAmountNeeded)])
    }
  }, [remainingAmountNeeded, donationAmount])

  // Check authentication status before rendering the donation form
  // If not authenticated, we'll still render the page but with a login prompt instead of the form

  if (!request) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Request Not Found</h1>
            <p className="text-muted-foreground mb-6">The request you're trying to donate to doesn't exist.</p>
            <Button onClick={() => router.push('/')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Back to Requests
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleSliderChange = (value: number[]) => {
    // Check authentication before allowing interaction
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }
    
    setDonationAmount(value)
    setIsCustom(false)
    setCustomAmount('')
    setDonationError(null)
  }

  const handleCustomAmountChange = (value: string) => {
    // Check authentication before allowing interaction
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }
    
    setCustomAmount(value)
    setIsCustom(true)
    setDonationError(null)
    
    if (value && !isNaN(Number(value))) {
      setDonationAmount([Number(value)])
    }
  }
  
  const handleDonateAction = () => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      // Store current URL for redirection after authentication
      localStorage.setItem('redirectAfterAuth', window.location.pathname)
      // Open sign-in modal
      openModal('signIn')
      return
    }
    
    // Continue with donation process for authenticated users
    return true
  }

  const handleDonate = async () => {
    // Use the handleDonateAction function to check authentication
    if (!handleDonateAction()) {
      return
    }

    const finalAmount = isCustom ? Number(customAmount) : donationAmount[0]

    if (finalAmount <= 0) {
      setDonationError('Please enter a valid donation amount.')
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
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
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-card-foreground mb-4">Request Info</h2>
          
          <div className="space-y-2 mb-6">
            <p className="text-card-foreground">
              <span className="font-medium">Request amount:</span> ${requestGoalAmount.toLocaleString()}
            </p>
            <p className="text-card-foreground">
              <span className="font-medium">Current amount:</span> ${requestCurrentAmount.toLocaleString()}
            </p>
            <p className="text-card-foreground">
              <span className="font-medium">Remaining needed:</span> ${remainingAmountNeeded.toLocaleString()}
            </p>
          </div>

          {/* Request Title */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-card-foreground mb-2">{request.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
          </div>
        </div>

        {/* Conditional rendering based on authentication status */}
        {isAuthenticated ? (
          /* Donation Section - Only shown to authenticated users */
          <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-6">Donate the amount you want</h2>
          
          {/* Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-sm font-medium text-card-foreground">
                Amount: ${displayAmount.toLocaleString()}
              </Label>
              <span className="text-sm text-muted-foreground">Max: ${remainingAmountNeeded.toLocaleString()}</span>
            </div>
            
        <Slider
            value={donationAmount}
          onValueChange={handleSliderChange}
          max={remainingAmountNeeded > 0 ? remainingAmountNeeded : 1}
          min={1}
          step={1}
          disabled={remainingAmountNeeded <= 0}
        />

            
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$1</span>
              <span>${remainingAmountNeeded.toLocaleString()}</span>
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="mb-8">
            <Label htmlFor="custom-amount" className="text-sm font-medium text-card-foreground mb-2 block">
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
              max={remainingAmountNeeded}
              disabled={remainingAmountNeeded <= 0}
            />
          </div>

          {/* Preset Amount Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[10, 25, 50, 100].map((amount) => (
              <Button
                key={amount}
                variant={displayAmount === amount && !isCustom ? "default" : "outline"}
                onClick={() => {
                  // Check authentication before allowing interaction
                  if (!isAuthenticated) {
                    localStorage.setItem('redirectAfterAuth', window.location.pathname);
                    openModal('signIn');
                    return;
                  }
                  
                  setDonationAmount([amount])
                  setIsCustom(false)
                  setCustomAmount('')
                  setDonationError(null)
                }}
                className="text-sm"
                disabled={amount > remainingAmountNeeded || remainingAmountNeeded <= 0}
              >
                ${amount}
              </Button>
            ))}
          </div>

          {/* Donation Error Message */}
          {donationError && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{donationError}</span>
            </div>
          )}

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={isProcessing || displayAmount <= 0 || displayAmount > remainingAmountNeeded || remainingAmountNeeded <= 0}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-medium"
          >
            {isProcessing ? 'Processing...' : `Donate $${displayAmount.toLocaleString()}`}
          </Button>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-green-500 dark:bg-green-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm font-medium text-foreground">Secure Donation</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your donation is secure and encrypted. 100% of your donation goes directly to the cause.
            </p>
          </div>
        </div>
        ) : (
          /* Login Prompt - Shown to unauthenticated users */
          <div className="bg-card rounded-lg shadow-sm border p-6 text-center">
            <h2 className="text-xl font-bold text-card-foreground mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to make a donation. Please sign in or create an account to continue.
            </p>
            <Button
              onClick={() => {
                localStorage.setItem('redirectAfterAuth', window.location.pathname);
                openModal('signIn');
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 text-lg font-medium"
            >
              Sign In to Donate
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}