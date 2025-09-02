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

export default function RequestPage() {
  const params = useParams()
  const router = useRouter()
  const donationId = Number(params.id)

  const { getDonationById } = useDonationsStore()
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()

  const [donation, setDonation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [requestAmount, setRequestAmount] = useState([1])
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  // Pending transactions state
  const [pendingTransactions, setPendingTransactions] = useState<
    { id: string; amount: number; requestId: string }[]
  >([])

  // Fetch donation by ID
  useEffect(() => {
    const loadDonation = async () => {
      setIsLoading(true)
      try {
        const donationData = await getDonationById(donationId)
        if (!donationData) {
          console.warn(`Donation with ID ${donationId} not found or could not be loaded`)
          setDonation(null)
        } else {
          setDonation(donationData)
        }
      } catch (err) {
        console.error('Donation not found:', err)
        setDonation(null)
      } finally {
        setIsLoading(false)
      }
    }
    loadDonation()
  }, [donationId, getDonationById])

  // Load pending requests from localStorage
  useEffect(() => {
    const storedPending = JSON.parse(localStorage.getItem('pendingDonations') || '[]')
    const filtered = storedPending.filter((tx: any) => tx.requestId === params.id)
    setPendingTransactions(filtered)
  }, [params.id])

  if (isLoading) return <LoadingState />
  if (!donation) return <NotFoundState router={router} />

  const donationAmount = donation.possibleAmount || donation.goalAmount || 0
  const remainingAmount = donationAmount

  const finalAmount = isCustom
    ? Math.min(Math.max(Number(customAmount), 1), remainingAmount)
    : Math.min(Math.max(requestAmount[0], 1), remainingAmount)

  const handleSliderChange = (value: number[]) => {
    setRequestAmount(value)
    setIsCustom(false)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setIsCustom(true)
    if (value && !isNaN(Number(value))) {
      const numValue = Number(value)
      setRequestAmount([Math.min(Math.max(numValue, 1), remainingAmount)])
    }
  }

  const handleSubmitRequest = async () => {
    // Reset any previous error
    setVerificationError(null)
    
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }
    
    // Check if user is verified before allowing to make a request
    const { user } = useAuthStore.getState()
    if (!user?.verified && !user?.email_verified_at) {
      setVerificationError('Only verified users can make requests. Please verify your account first to ensure donation security and prevent fraud.')
      return
    }

    setIsProcessing(true)
    try {
      const requestId = Math.floor(Math.random() * 1000000).toString()
      await new Promise(resolve => setTimeout(resolve, 2000)) // simulate processing

      const storedPending = JSON.parse(localStorage.getItem('pendingDonations') || '[]')
      storedPending.push({ id: requestId, amount: finalAmount, requestId: params.id })
      localStorage.setItem('pendingDonations', JSON.stringify(storedPending))

      router.push(`/request/success?requestId=${requestId}&donationId=${donationId}&amount=${finalAmount}`)
    } catch (error) {
      console.error('Failed to submit request:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            onClick={() => router.back()}
            className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Donation Info */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Donation Info</h2>
          <div className="space-y-2 mb-6">
            <p className="text-card-foreground">
              <span className="font-medium">Donation title:</span> {donation.title}
            </p>
            <p className="text-card-foreground">
              <span className="font-medium">Donation amount:</span> {donationAmount.toLocaleString()}
            </p>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{donation.description}</p>
          </div>
        </div>

        {/* Request Amount Section */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Request Amount</h2>

          {/* Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-sm font-medium text-foreground">
                Amount: {finalAmount.toLocaleString()}
              </Label>
              <span className="text-sm text-muted-foreground">
                Max: {remainingAmount.toLocaleString()}
              </span>
            </div>
            <Slider
              value={requestAmount}
              onValueChange={handleSliderChange}
              max={remainingAmount}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>1</span>
              <span>{remainingAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Custom Amount Input */}
      <div className="mb-8 space-y-4">
  <Label 
    htmlFor="custom-amount" 
    className="text-sm font-medium text-foreground block"
  >
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
    max={remainingAmount}
  />
</div>

          {/* Preset Amount Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[10, 25, 50, 100].map(amount => (
              <Button
                key={amount}
                variant={requestAmount[0] === amount && !isCustom ? "default" : "outline"}
                onClick={() => {
                  setRequestAmount([Math.min(amount, remainingAmount)])
                  setIsCustom(false)
                  setCustomAmount('')
                }}
                className="text-sm"
                disabled={amount > remainingAmount}
              >
                {amount}
              </Button>
            ))}
          </div>

          {/* Submit Button with Verification Error Label */}
          <div className="relative">
            {verificationError && (
              <div className="text-red-600 text-sm font-medium mb-2">
                {verificationError}
              </div>
            )}
            <Button
              onClick={handleSubmitRequest}
              disabled={isProcessing || finalAmount <= 0}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-medium"
            >
              {isProcessing ? 'Processing...' : `Request ${finalAmount.toLocaleString()}`}
            </Button>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingTransactions.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-400 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Your Pending Requests</h4>
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
    </MainLayout>
  )
}

// Loading & Not Found states
function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
    </div>
  )
}

function NotFoundState({ router }: { router: any }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-foreground mb-4">Donation Not Found</h1>
      <Button 
        onClick={() => router.push('/donations')} 
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        Back to Donations
      </Button>
    </div>
  )
}
