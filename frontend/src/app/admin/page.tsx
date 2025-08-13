"use client"
import { CommunityChart } from "@/components/admin/dashboard/communityChart"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { StatsCards } from "@/components/admin/dashboard/statsCards"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Get token from localStorage (adjust this based on your auth system)
    const authToken = localStorage.getItem("authToken") || localStorage.getItem("token")
    setToken(authToken)
  }, [])

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
            <SidebarInset className="p-4 md:p-6 flex-1 flex flex-col space-y-8">
              <div className="w-full">
                <h2 className="text-3xl font-bold tracking-tight mb-6">Dashboard Overview</h2>
                <StatsCards token={token || undefined} />
              </div>
              <div className="w-full">
                <CommunityChart token={token || undefined} />
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AdminLayout>
  )
}
