import { AdminLayout } from "@/components/layouts/AdminLayout"
import { BlogsAdminPageClient } from "./BlogsAdminPageClient"

export function BlogsAdminPage() {
  return (
    <AdminLayout>
      <BlogsAdminPageClient />
    </AdminLayout>
  )
}