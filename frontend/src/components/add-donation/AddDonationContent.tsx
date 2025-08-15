'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AddDonationForm } from '@/components/add-donation/AddDonationForm'

// Re-use the same shape as your page/store expects
export type AddDonationFormValues = {
  title: string
  description: string
  type: 'request' | 'offer'
  goalAmount: number
  unit: string
  endDate: string // 'YYYY-MM-DD'
  locationId: number
  imageUrl?: string
}

interface AddDonationContentProps {
  onSubmit?: (values: AddDonationFormValues) => Promise<void>
  submitting?: boolean
  error?: string | null
}

export function AddDonationContent({ onSubmit, submitting, error }: AddDonationContentProps) {
  const router = useRouter()

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="flex items-center text-white hover:text-white p-2 bg-red-500 hover:bg-red-600 rounded-full w-10 h-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Add Donation</h1>
      </div>

      {/* Forward props to the form */}
      <AddDonationForm onSubmit={onSubmit} submitting={submitting} error={error} />
    </main>
  )
}
