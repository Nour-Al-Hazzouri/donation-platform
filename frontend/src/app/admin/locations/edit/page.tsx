export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { AdminLayout } from '@/components/layouts/AdminLayout'
import LocationEditPageClient from '@/components/admin/locations/edit/LocationEditPageClient'

export default function EditLocationPage() {
  return (
    <AdminLayout>
      <LocationEditPageClient />
    </AdminLayout>
  )
}