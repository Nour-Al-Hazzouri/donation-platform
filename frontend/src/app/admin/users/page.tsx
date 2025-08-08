"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ManageUsers } from "@/components/admin/dashboard/ManageUsers"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function UsersManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
      <SidebarProvider>
        {/* Mobile sidebar overlay */}
        <div className={`md:hidden fixed inset-0 z-40 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full bg-white z-50 shadow-lg">
            <DashboardSidebar />
          </div>
        </div>

        <div className="flex min-h-screen w-full overflow-x-hidden">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 w-0 min-w-0 flex flex-col">
            {/* Mobile toggle button */}
            <div className="md:hidden p-4">
              <Button variant="outline" size="sm" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            <SidebarInset className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="mb-6">
                <div className="flex space-x-2 border-b border-gray-200">
                  <a
                    href="/admin/users"
                    className={`px-4 py-2 text-sm font-medium ${activeTab === "All" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    All Users
                  </a>
                  <a
                    href="/admin/users?tab=verification"
                    className={`px-4 py-2 text-sm font-medium ${activeTab === "Verification" ? "text-red-600 border-b-2 border-red-600" : "text-gray-500 hover:text-gray-700"}`}
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
    </AdminLayout>
  )
}