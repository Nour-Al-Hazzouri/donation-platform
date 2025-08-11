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
  const { donations } = useDonationsStore()
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()
  
  const [requestAmount, setRequestAmount] = useState([1])
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Find the donation by ID
  const donation = donations.find(donation => donation.id === donationId)

  if (!donation) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Donation Not Found</h1>
            <p className="text-muted-foreground mb-6">The donation you're trying to request doesn't exist.</p>
            <Button onClick={() => router.push('/donations')} className="bg-red-500 hover:bg-red-600 text-white">
              Back to Donations
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const donationAmount = parseFloat(donation.donationAmount || '1000')
  const remainingAmount = donationAmount // Simplified for this example

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
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }

    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // simulate processing

      const finalAmount = isCustom
        ? Math.min(Math.max(Number(customAmount), 1), remainingAmount)
        : requestAmount[0]

      router.push(`/request/success?amount=${finalAmount}&donationId=${donationId}`)
    } catch (error) {
      console.error('Failed to submit request:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const finalAmount = isCustom
    ? Math.min(Math.max(Number(customAmount), 1), remainingAmount)
    : Math.min(Math.max(requestAmount[0], 1), remainingAmount)

  if (!isAuthenticated) {
    return null
  }

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

        {/* Donation Info Section */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Donation Info</h2>
          
          <div className="space-y-2 mb-6">
            <p className="text-card-foreground">
              <span className="font-medium">Donation title:</span> {donation.title}
            </p>
            <p className="text-card-foreground">
              <span className="font-medium">Donation amount:</span> ${donationAmount.toLocaleString()}
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{donation.description}</p>
          </div>
        </div>

        {/* Request Section */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Request Amount</h2>
          
          {/* Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-sm font-medium text-foreground">
                Amount: ${finalAmount.toLocaleString()}
              </Label>
              <span className="text-sm text-muted-foreground">Max: ${remainingAmount.toLocaleString()}</span>
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
              <span>$1</span>
              <span>${remainingAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="mb-8">
            <Label htmlFor="custom-amount" className="text-sm font-medium text-foreground mb-2 block">
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
            {[10, 25, 50, 100].map((amount) => (
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
                ${amount}
              </Button>
            ))}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitRequest}
            disabled={isProcessing || finalAmount <= 0}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-medium"
          >
            {isProcessing ? 'Processing...' : `Request $${finalAmount.toLocaleString()}`}
          </Button>

          {/* Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Secure Request</span>
            </div>
            <p className="text-xs text-gray-600">
              Your request information will be processed securely and confidentially.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}