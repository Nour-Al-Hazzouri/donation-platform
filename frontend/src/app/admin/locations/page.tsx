import { LocationsAdminPage } from "@/components/admin/locations/LocationsAdminPage"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Locations - GiveLeb",
  description: "Manage locations for donations",
}

export default function LocationsPage() {
  return <LocationsAdminPage />
}