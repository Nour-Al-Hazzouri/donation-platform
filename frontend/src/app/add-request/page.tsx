export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { MainLayout } from "@/components/layouts/MainLayout"
import AddRequestPageClient from '@/components/add-request/AddRequestPageClient'

export default function AddRequestPage() {
  return (
    <MainLayout>
      <AddRequestPageClient />
    </MainLayout>
  )
}
