import { CommunityChart } from "@/components/admin/dashboard/communityChart"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { StatsCards } from "@/components/admin/dashboard/statsCards"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <SidebarProvider>
        <div className="flex flex-1">
          <DashboardSidebar />
          <SidebarInset className="flex-1">
            <main className="p-6 flex-1">
              <StatsCards />
              <CommunityChart />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AdminLayout>
  )
}
