'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layouts/MainLayout'
import { useEffect, useState } from 'react'
import { useDonationsStore } from "@/store/donationsStore"

export default function RequestSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [requestId, setRequestId] = useState('')
  const [donationId, setDonationId] = useState('')
  const { donations } = useDonationsStore()

  useEffect(() => {
    setRequestId(searchParams.get('requestId') || '')
    setDonationId(searchParams.get('donationId') || '') // Get donationId from query params
  }, [searchParams])

  const matchedRequest = donations.find(d => d.id.toString() === requestId)

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-background">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your Request Has Been Submitted!
          </h1>

          <p className="text-lg text-muted-foreground mb-2">
            Thank you for submitting your request. We will review it shortly and notify you of any updates.
          </p>

          {matchedRequest && (
            <p className="text-muted-foreground text-sm mb-4">
              Request Title: <span className="font-semibold">{matchedRequest.title}</span>
            </p>
          )}

          <p className="text-muted-foreground mb-8">
            You will receive a confirmation email with your request details.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              onClick={() => router.push(`/donations/${donationId}`)} // Link to the specific donation
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
            >
              View Donation
            </Button>
            <Button
              onClick={() => router.push('/donations')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              View Other Donations
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-card rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Our team will review your request and verify the details</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>We may contact you for additional information if needed</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>You will be notified once your request is approved and made public</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}