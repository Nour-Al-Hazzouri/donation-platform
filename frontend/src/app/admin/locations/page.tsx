export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { Metadata } from "next"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { LocationsAdminPageWrapper } from "@/components/admin/locations/LocationsAdminPageWrapper"

export const metadata: Metadata = {
  title: "Manage Locations - GiveLeb",
  description: "Manage locations for donations",
}

export default function LocationsPage() {
  return (
    <AdminLayout>
      <LocationsAdminPageWrapper />
    </AdminLayout>
  )
}