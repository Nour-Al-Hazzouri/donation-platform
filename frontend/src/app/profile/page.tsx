import { Suspense } from 'react'
import { ProfilePageClient } from './ProfilePageClient'

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePageClient />
    </Suspense>
  )
}
