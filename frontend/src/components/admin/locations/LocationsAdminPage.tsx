import { AdminLayout } from "@/components/layouts/AdminLayout"
import { LocationsAdminPageClient } from "@/components/admin/locations/LocationsAdminPageClient"

export function LocationsAdminPage() {
  // All client-side logic moved to LocationsAdminPageClient component

  return (
    <AdminLayout>
      <LocationsAdminPageClient />
    </AdminLayout>
  )
}