"use client"

import { useRouter } from "next/navigation"
import { ManageUsers } from "@/components/admin/dashboard/ManageUsers"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function VerificationRequestsPage() {
  const router = useRouter()

  return (
    <AdminLayout>
      <SidebarProvider>
        <div className="flex min-h-screen w-full overflow-x-hidden">
          {/* Desktop sidebar - only visible on md screens and up */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 w-full min-w-0 flex flex-col">
            <SidebarInset className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Verification Requests</h1>
                <p className="text-gray-600 mt-1">Review and manage user verification requests</p>
              </div>
              
              <ManageUsers activeTab="Verification" />
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AdminLayout>
  )
}