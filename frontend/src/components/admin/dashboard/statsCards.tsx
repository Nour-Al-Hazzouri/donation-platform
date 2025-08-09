import { Card, CardContent } from "@/components/ui/card"

// Mock data for dashboard statistics
const DASHBOARD_STATS = [
  { label: "Global Users", value: "800" },
  { label: "Donations", value: "500" },
  { label: "Requests", value: "400" },
]

export function StatsCards() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {DASHBOARD_STATS.map((stat, index) => (
        <Card key={index} className="bg-white shadow-sm hover:shadow transition-shadow duration-200">
          <CardContent className="p-6 text-center">
            <div className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}