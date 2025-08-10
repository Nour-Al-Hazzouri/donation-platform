"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ManageUsers, UsersProvider } from "@/components/admin/dashboard/ManageUsers"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function UsersManagementPage() {
  const [activeTab, setActiveTab] = useState("All")
  const searchParams = useSearchParams()
  
  // Set active tab based on URL query parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "verification") {
      setActiveTab("Verification")
    } else {
      setActiveTab("All")
    }
  }, [searchParams])

  return (
    <AdminLayout>
      <UsersProvider>
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Manage Users</h1>
                  <div className="flex flex-wrap overflow-x-auto border-b border-gray-200">
                    <a
                      href="/admin/users"
                      className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "All" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      All Users
                    </a>
                    <a
                      href="/admin/users?tab=verification"
                      className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === "Verification" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      Verification Requests
                    </a>
                  </div>
                </div>
                
                <ManageUsers activeTab={activeTab} />
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      </UsersProvider>
    </AdminLayout>
  )
}