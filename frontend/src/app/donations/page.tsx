import { Suspense } from 'react'
import DonationsClient from '@/components/donations/DonationsClient'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function DonationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonationsClient />
    </Suspense>
  )
}
