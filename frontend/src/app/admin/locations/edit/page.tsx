import { Suspense } from 'react'
import { EditLocationPageClient } from '../edit/EditLocationPageClient'

function EditLocationPageLoading() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default function EditLocationPage() {
  return (
    <Suspense fallback={<EditLocationPageLoading />}>
      <EditLocationPageClient />
    </Suspense>
  )
}