import { Card, CardContent } from "@/components/ui/card"

export function StatsCards() {
  const stats = [
    { label: "Global Users", value: "800" },
    { label: "Donations", value: "500" },
    { label: "Requests", value: "400" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 w-full">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}