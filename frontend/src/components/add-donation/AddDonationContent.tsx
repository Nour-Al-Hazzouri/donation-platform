'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AddDonationForm } from '@/components/add-donation/AddDonationForm'

export function AddDonationContent() {
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

      <AddDonationForm />
    </main>
  )
}