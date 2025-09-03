'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { MainLayout } from '@/components/layouts/MainLayout'
import { useDonationsStore } from '@/store/donationsStore'

export function DonationSuccessPageClient() {
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
  const [isValidParams, setIsValidParams] = useState(true)

  useEffect(() => {
    const amount = searchParams.get('amount')
    const requestIdStr = searchParams.get('requestId')
    const transactionIdStr = searchParams.get('transactionId')

    if (!amount || !requestIdStr) {
      setIsValidParams(false)
      setIsLoading(false)
      return
    }

    const requestIdNum = Number(requestIdStr)
    if (Number.isNaN(requestIdNum)) {
      setIsValidParams(false)
      setIsLoading(false)
      return
    }

    const loadDetails = async () => {
      try {
        const requestData = await getDonationById(requestIdNum)
        let transactionData = null

        if (transactionIdStr) {
          const txIdNum = Number(transactionIdStr)
          if (!Number.isNaN(txIdNum)) {
            transactionData = await getTransaction(txIdNum)
          }
        }

        setRequestDetails({
          title: requestData?.title || 'Donation',
          amount,
          requestId: requestIdStr,
          transactionId: transactionIdStr || ''
        })
      } catch (error) {
        console.error('Error loading details:', error)
        setRequestDetails(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadDetails()
  }, [searchParams, getDonationById, getTransaction])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we load your donation details.</p>
        </div>
      </MainLayout>
    )
  }

  if (!isValidParams || !requestDetails) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Donation Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find details for your donation.</p>
          <Button onClick={() => router.push('/requests')} className="bg-red-500 hover:bg-red-600 text-white">
            Browse Requests
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-6">
          <CheckCircle2 className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">Thank You for Your Donation!</h1>

        <p className="text-lg text-muted-foreground mb-2">
          Your donation of <span className="font-semibold text-yellow-600 dark:text-yellow-400">
            {parseInt(requestDetails.amount).toLocaleString()}
          </span> is <strong>pending approval</strong> by the request creator.
        </p>

        <p className="text-muted-foreground mb-8">
          You will be notified once your donation is accepted or rejected.
        </p>

        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-8">
          <Button
            onClick={() => router.push('/requests')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Browse More Requests
          </Button>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">What happens next?</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>The request owner will review your donation.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>You will receive an update when it is accepted or rejected.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>A receipt will be sent to your email once approved.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
