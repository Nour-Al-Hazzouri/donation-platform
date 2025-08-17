import { AdminLayout } from "@/components/layouts/AdminLayout"
import { UsersProvider } from "@/components/admin/dashboard/ManageUsers"
import ManageUserPageClient from "@/components/admin/users/ManageUserPageClient"

// Main page component
export default function UserManagePage() {
  return (
    <AdminLayout>
      <UsersProvider>
        <ManageUserPageClient />
      </UsersProvider>
    </AdminLayout>
  )
}