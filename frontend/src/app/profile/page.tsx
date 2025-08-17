import { Suspense } from 'react'
import ProfileClient from '@/components/profile/ProfileClient'
import { SidebarProvider } from '@/components/ui/sidebar'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarProvider>
        <ProfileClient />
      </SidebarProvider>
    </Suspense>
  )
}
