'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layouts/MainLayout'
import { useEffect, useState } from 'react'
import { useDonationsStore } from "@/store/donationsStore"

export function RequestSuccessPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getDonationById } = useDonationsStore()

  const [requestDetails, setRequestDetails] = useState<{
    title: string
    amount: number
    requestId: string
    donationId: number
    transactionId?: string
  } | null>(null)

  const [pendingTransactions, setPendingTransactions] = useState<{ id: string; amount: number; requestId: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const requestId = searchParams.get('requestId')
    const amountStr = searchParams.get('amount')
    const donationIdStr = searchParams.get('donationId')
    const transactionId = searchParams.get('transactionId')

    if (!requestId || !amountStr || !donationIdStr) {
      setIsLoading(false)
      return
    }

    const donationId = Number(donationIdStr)
    const loadRequest = async () => {
      try {
        const donation = await getDonationById(donationId)
        setRequestDetails({
          title: donation?.title || 'Donation',
          amount: Number(amountStr),
          requestId,
          donationId,
          transactionId: transactionId || undefined
        })

        // Load pending transactions from localStorage
        const storedPending = JSON.parse(localStorage.getItem('pendingDonations') || '[]')
        const filtered = storedPending.filter((tx: any) => tx.requestId === requestId)
        setPendingTransactions(filtered)
      } catch (err) {
        console.error("Error loading donation:", err)
        setRequestDetails({
          title: 'Donation',
          amount: Number(amountStr),
          requestId,
          donationId,
          transactionId: transactionId || undefined
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadRequest()
  }, [searchParams, getDonationById])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </MainLayout>
    )
  }

  if (!requestDetails) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Request Not Found</h1>
          <Button 
            onClick={() => router.push('/donations')} 
            className="bg-red-500 hover:bg-red-600 text-white mt-4"
          >
            Browse Donations
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-6">
          <CheckCircle2 className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Your Request Has Been Submitted!
        </h1>

        {/* Request Info */}
        <p className="text-lg text-muted-foreground mb-2">
          Your request of{" "}
          <span className="font-semibold text-yellow-600">
            {requestDetails.amount.toLocaleString()}
          </span>{" "}
          for <span className="font-semibold">{requestDetails.title}</span> is{" "}
          <strong>pending approval</strong>.
        </p>



        {/* Info */}
        <p className="text-muted-foreground mb-8">
          You will be notified once your request is reviewed.
        </p>

        {/* Actions */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-8">
          <Button
            onClick={() => router.push('/donations')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Browse More Donations
          </Button>
        </div>

        {/* Next Steps */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">What happens next?</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>The request owner will review your submission.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>You will receive an update when it is approved or rejected.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>A notification will be sent to your email once approved.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
