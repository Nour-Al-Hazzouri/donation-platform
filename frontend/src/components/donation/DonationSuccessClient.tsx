'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowLeft, Home } from 'lucide-react'
import { useDonationsStore, DonationData } from '@/store/donationsStore'

export default function DonationSuccessClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getDonations } = useDonationsStore()
  const [donationDetails, setDonationDetails] = useState<{ title: string; amount: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const donationIdStr = searchParams.get('id')
      if (!donationIdStr) {
        router.push('/donations')
        return
      }

      const donationId = parseInt(donationIdStr, 10)
      try {
        // await the async API/store call
        const donations: DonationData[] = await getDonations()
        const donation = donations.find(d => d.id === donationId)

        if (donation) {
          setDonationDetails({
            title: donation.title,
            amount: donation.donationAmount || '0'
          })
        } else {
          // not found: navigate back to donations listing
          router.push('/donations')
        }
      } catch (err) {
        console.error('Error loading donations in success page:', err)
        router.push('/donations')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [searchParams, router, getDonations])

  if (isLoading) {
    return null
  }

  if (!donationDetails) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <div className="bg-card rounded-lg shadow-sm border p-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Donation Successful!</h1>
        <p className="text-muted-foreground mb-6">Thank you for your generosity. Your donation has been successfully processed.</p>

        <div className="bg-background rounded-lg border p-4 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Donation Details</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Title:</span> {donationDetails.title}
            </p>
            <p className="text-sm">
              <span className="font-medium">Amount:</span> ${parseFloat(donationDetails.amount).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-md transition-colors"
            onClick={() => router.push('/donations')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white" onClick={() => router.push('/')}>
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>Your donation will help make a difference in someone's life.</p>
          <p>A confirmation email has been sent to your registered email address.</p>
        </div>
      </div>
    </div>
  )
}