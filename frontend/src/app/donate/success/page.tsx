'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { MainLayout } from '@/components/layouts/MainLayout'
import { useDonationsStore } from '@/store/donationsStore'

export default function DonationSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getDonationById, getTransaction } = useDonationsStore()
  const [requestDetails, setRequestDetails] = useState<{
    title: string
    amount: string
    requestId: string
    transactionId: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const amount = searchParams.get('amount')
    const requestId = searchParams.get('requestId')
    const transactionId = searchParams.get('transactionId')
    
    if (!amount || !requestId) {
      router.push('/requests')
      return
    }

    const loadDetails = async () => {
      try {
        const requestData = await getDonationById(parseInt(requestId))
        let transactionData = null
        
        if (transactionId) {
          transactionData = await getTransaction(parseInt(transactionId))
        }
        
        setRequestDetails({
          title: requestData?.title || 'Donation',
          amount: amount,
          requestId: requestId,
          transactionId: transactionId || ''
        })
      } catch (error) {
        console.error('Error loading details:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDetails()
  }, [searchParams, router, getDonationById, getTransaction])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Loading...</h1>
            <p className="text-muted-foreground mb-6">Please wait while we load your donation details.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!requestDetails) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Donation Not Found</h1>
            <p className="text-muted-foreground mb-6">We couldn't find details for your donation.</p>
            <Button onClick={() => router.push('/requests')} className="bg-red-500 hover:bg-red-600 text-white">
              Browse Requests
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-background">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Thank You for Your Donation!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-2">
            Your donation of <span className="font-semibold text-green-600 dark:text-green-400">${parseInt(requestDetails.amount).toLocaleString()}</span> has been processed successfully.
          </p>
          
          <p className="text-muted-foreground mb-8">
            You will receive a confirmation email shortly with your donation receipt.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              onClick={() => router.push(`/requests/${requestDetails.requestId}`)}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
            >
              View Request
            </Button>
            <Button
              onClick={() => router.push('/requests')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Browse More Requests
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Your donation will be transferred directly to the beneficiary</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>You'll receive updates on how your donation is being used</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>A tax-deductible receipt will be sent to your email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
