export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { MainLayout } from "@/components/layouts/MainLayout"
import RequestsPageClient from '@/components/requests/RequestsPageClient'

export default function RequestsPage() {
  return (
    <MainLayout>
      <RequestsPageClient />
    </MainLayout>
  )
}
