export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { AdminLayout } from "@/components/layouts/AdminLayout"
import { UsersManagementPageClient } from "@/components/admin/users/UsersManagementPageClient"

export default function UsersManagementPage() {
  return (
    <AdminLayout>
      <UsersManagementPageClient />
    </AdminLayout>
  )
}