'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MainLayout } from '@/components/layouts/MainLayout'
import { useDonationsStore } from "@/store/donationsStore"
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'
import transactionsApi from '@/lib/api/transactions'
import donationsService from '@/lib/api/donations'

const parseAmount = (value: string | number | undefined | null): number => {
  if (typeof value === 'number') return isNaN(value) ? 0 : value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = parseFloat(value.replace(/[^0-9.-]+/g,""))
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

export function DonatePageClient() {
  const params = useParams()
  const router = useRouter()
  const { getDonationById } = useDonationsStore()
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()

  const [request, setRequest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [donationAmount, setDonationAmount] = useState<number[]>([0])
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [donationError, setDonationError] = useState<string | null>(null)
  const [pendingTransactions, setPendingTransactions] = useState<{ id: number; amount: number; requestId: number }[]>([])

  const requestId = parseInt(params.id as string)

  // Load request data
  useEffect(() => {
    const loadRequest = async () => {
      setIsLoading(true)
      try {
        const res = await donationsService.getEvent(requestId)
        const event = res?.data ?? res
        setRequest(event)
      } catch (err) {
        console.error('Error loading request:', err)
        try {
          const maybe = await getDonationById(requestId)
          setRequest(maybe)
        } catch {}
      } finally {
        setIsLoading(false)
      }
    }
    loadRequest()
  }, [requestId, getDonationById])

  // Load pending transactions from localStorage
  useEffect(() => {
    const storedPending = JSON.parse(localStorage.getItem('pendingDonations') || '[]')
    const filtered = storedPending.filter((tx: any) => tx.requestId === requestId)
    setPendingTransactions(filtered)
  }, [requestId])

  const requestGoalAmount = request ? parseAmount(request.goal_amount) : 0
  const requestCurrentAmount = request ? parseAmount(request.current_amount) : 0
  const remainingAmountNeeded = Math.max(0, requestGoalAmount - requestCurrentAmount)

  // Initialize slider
  useEffect(() => {
    if (remainingAmountNeeded > 0 && donationAmount[0] === 0) {
      setDonationAmount([Math.min(50, remainingAmountNeeded)])
    }
  }, [remainingAmountNeeded])

  const handleSliderChange = (value: number[]) => {
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
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }
    setCustomAmount(value)
    setIsCustom(true)
    setDonationError(null)
    if (value && !isNaN(Number(value))) setDonationAmount([Number(value)])
  }

  const handleDonateAction = () => {
    if (!isAuthenticated) {
      openModal('signIn')
      return false
    }
    return true
  }

  const handleDonate = async () => {
    if (!handleDonateAction()) return
    
    // Check if user is verified before allowing to make a donation
    const { user } = useAuthStore.getState()
    if (!user?.verified && !user?.email_verified_at) {
      setDonationError('Only verified users can make donations. Please verify your account first to ensure donation security and prevent fraud.')
      return
    }

    const finalAmount = isCustom ? Number(customAmount) : donationAmount[0]
    
    if (finalAmount <= 0 || finalAmount > remainingAmountNeeded) {
      setDonationError('Please enter a valid donation amount.')
      return
    }

    setIsProcessing(true)
    setDonationError(null)

    try {
      const transactionData = {
        amount: finalAmount,
        event_id: requestId,
        description: `Donation to ${request?.title || 'request'}`
      }

      const response = await transactionsApi.createTransaction(requestId, transactionData)
      const transaction = response

      if (transaction?.id) {
        router.push(`/donate/success?amount=${finalAmount}&requestId=${requestId}&transactionId=${transaction.id}`)
      } else {
        throw new Error('Transaction creation failed')
      }
    } catch (error) {
      console.error('Donation error:', error)
      setDonationError('Failed to process donation. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const displayAmount = isCustom ? Number(customAmount) || 0 : donationAmount[0]

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
        </div>
      </MainLayout>
    )
  }

  if (!request) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Request Not Found</h1>
          <Button onClick={() => router.push('/requests')} className="bg-red-500 hover:bg-red-600 text-white">
            Back to Requests
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center text-white hover:text-white p-2 bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Request Info */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Request Info</h2>
          <p><span className="font-medium">Request amount:</span> {requestGoalAmount.toLocaleString()}</p>
          <p><span className="font-medium">Current amount:</span> {requestCurrentAmount.toLocaleString()}</p>
          <p><span className="font-medium">Remaining needed:</span> {remainingAmountNeeded.toLocaleString()}</p>
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold">{request.title}</h3>
            <p className="text-sm text-muted-foreground">{request.description}</p>
          </div>
        </div>

        {/* Donation Form */}
        {isAuthenticated ? (
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-6">Donate the amount you want</h2>

            {/* Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <Label>Amount: {displayAmount.toLocaleString()}</Label>
                <span className="text-sm text-muted-foreground">Max: {remainingAmountNeeded.toLocaleString()}</span>
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
                <span>1</span>
                <span>{remainingAmountNeeded.toLocaleString()}</span>
              </div>
            </div>

            {/* Custom Amount */}
         <div className="mb-8 space-y-2">
  <Label htmlFor="custom-amount" className="block text-sm font-medium text-foreground">
    Or enter a custom amount
  </Label>
  <Input
    id="custom-amount"
    type="number"
    placeholder="Enter amount"
    value={customAmount}
    onChange={(e) => handleCustomAmountChange(e.target.value)}
    min="1"
    max={remainingAmountNeeded}
    disabled={remainingAmountNeeded <= 0}
  />
</div>

            {/* Preset Buttons */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {[10,25,50,100].map(amount => (
                <Button
                  key={amount}
                  variant={displayAmount === amount && !isCustom ? "default" : "outline"}
                  onClick={() => {
                    setDonationAmount([amount])
                    setIsCustom(false)
                    setCustomAmount('')
                    setDonationError(null)
                  }}
                  disabled={amount > remainingAmountNeeded || remainingAmountNeeded <= 0}
                >
                  {amount}
                </Button>
              ))}
            </div>

            {donationError && (
              <div className="text-red-600 text-sm font-medium mb-2">
                {donationError}
              </div>
            )}

            {/* Donate Button */}
            <Button
              onClick={handleDonate}
              disabled={isProcessing || displayAmount <= 0 || displayAmount > remainingAmountNeeded || remainingAmountNeeded <= 0}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-medium"
            >
              {isProcessing ? 'Processing...' : `Donate ${displayAmount.toLocaleString()}`}
            </Button>

            {/* Pending Donations */}
            {pendingTransactions.length > 0 && (
              <div className="mt-6 bg-yellow-50 border border-yellow-400 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Pending Donations</h4>
                <ul className="list-disc list-inside text-yellow-900 text-sm">
                  {pendingTransactions.map(txn => (
                    <li key={txn.id}>
                      {txn.amount.toLocaleString()} — Pending approval
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow-sm border p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to make a donation.</p>
            <Button onClick={() => openModal('signIn')} className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 text-lg font-medium">
              Sign In to Donate
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
