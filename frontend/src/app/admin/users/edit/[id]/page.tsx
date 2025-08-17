'use client'
import { useParams } from "next/navigation"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { UsersProvider } from "@/components/admin/dashboard/ManageUsers"
import EditUserPageClient from "@/components/admin/users/EditUserPageClient"

export default function EditUserPage() {
  const params = useParams<{ id: string }>()
  const userId = params.id

  return (
    <AdminLayout>
      <UsersProvider>
        <EditUserPageClient />
      </UsersProvider>
    </AdminLayout>
  )
}