import { Suspense } from 'react'
import { RequestsPageClient } from './RequestsPageClient'

function RequestsPageLoading() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Loading requests...</p>
      </div>
    </div>
  )
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<RequestsPageLoading />}>
      <RequestsPageClient />
    </Suspense>
  )
}