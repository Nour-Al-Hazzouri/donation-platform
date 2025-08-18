export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { MainLayout } from '@/components/layouts/MainLayout'
import AddDonationPageClient from '@/components/add-donation/AddDonationPageClient'

export default function AddDonationPage() {
  return (
    <MainLayout>
      <AddDonationPageClient />
    </MainLayout>
  )
}
