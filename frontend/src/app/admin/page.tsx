"use client"

import { useState } from "react"
import { CommunityChart } from "@/components/admin/dashboard/communityChart"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { StatsCards } from "@/components/admin/dashboard/statsCards"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
              <StatsCards />
              <div className="flex-1">
                <CommunityChart />
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AdminLayout>
  )
}