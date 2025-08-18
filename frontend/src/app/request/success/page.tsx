export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { MainLayout } from '@/components/layouts/MainLayout'
import RequestSuccessClient from '@/components/request/RequestSuccessClient'

export default function RequestSuccessPage() {
  return (
    <MainLayout>
      <RequestSuccessClient />
    </MainLayout>
  )
}
