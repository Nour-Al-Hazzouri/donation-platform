import { BlogsAdminPage } from "@/components/admin/blogs/BlogsAdminPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Blogs - Admin Dashboard - GiveLeb",
  description: "Manage blog posts for the GiveLeb platform",
}

export default function BlogsPage() {
  return <BlogsAdminPage />
}