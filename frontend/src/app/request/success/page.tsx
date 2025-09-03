import { Suspense } from 'react'
import { RequestSuccessPageClient } from './RequestSuccessPageClient'

export default function RequestSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RequestSuccessPageClient />
    </Suspense>
  )
}
