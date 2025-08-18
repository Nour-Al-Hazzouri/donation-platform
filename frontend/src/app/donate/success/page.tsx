export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { MainLayout } from '@/components/layouts/MainLayout'
import DonateSuccessClient from '@/components/donate/DonateSuccessClient'

export default function DonationSuccessPage() {
  return (
    <MainLayout>
      <DonateSuccessClient />
    </MainLayout>
  )
}
