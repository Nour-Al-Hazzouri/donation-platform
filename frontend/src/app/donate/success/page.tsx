'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { MainLayout } from '@/components/layouts/MainLayout'
import { useEffect, useState } from 'react'

export default function DonationSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [requestId, setRequestId] = useState('')

  useEffect(() => {
    setAmount(searchParams.get('amount') || '0')
    setRequestId(searchParams.get('requestId') || '')
  }, [searchParams])

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You for Your Donation!
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Your donation of <span className="font-semibold text-green-600">${amount}</span> has been processed successfully.
          </p>
          
          <p className="text-gray-600 mb-8">
            You will receive a confirmation email shortly with your donation receipt.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button
              onClick={() => router.push(`/requests/${requestId}`)}
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
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-600">
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
