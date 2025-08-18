export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { MainLayout } from '@/components/layouts/MainLayout'
import DonationSuccessClient from '@/components/donation/DonationSuccessClient'

export default function DonationSuccessPage() {
  return (
    <MainLayout>
      <DonationSuccessClient />
    </MainLayout>
  )
}
