import { AdminLayout } from "@/components/layouts/AdminLayout"
import AdminDashboardClient from "@/components/admin/dashboard/AdminDashboardClient"

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <AdminDashboardClient />
    </AdminLayout>
  )
}