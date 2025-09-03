import { Suspense } from 'react'
import { DonationSuccessPageClient } from './DonationSuccessPageClient'

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonationSuccessPageClient />
    </Suspense>
  )
}
