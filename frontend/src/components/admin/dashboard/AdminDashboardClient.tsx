"use client"

import { useState } from "react"
import { CommunityChart } from "@/components/admin/dashboard/communityChart"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { StatsCards } from "@/components/admin/dashboard/statsCards"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function AdminDashboardClient() {
  return (
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
              <StatsCards />
            </div>
            <div className="w-full">
              <CommunityChart />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}