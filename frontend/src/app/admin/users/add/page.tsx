import { AdminLayout } from "@/components/layouts/AdminLayout"
import { UsersProvider } from "@/components/admin/dashboard/ManageUsers"
import AddUserPageClient from "@/components/admin/users/AddUserPageClient"

export default function AddUserPage() {
  return (
    <AdminLayout>
      <UsersProvider>
        <AddUserPageClient />
      </UsersProvider>
    </AdminLayout>
  )
}