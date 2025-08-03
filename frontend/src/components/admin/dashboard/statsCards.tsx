import { Card, CardContent } from "@/components/ui/card"

export function StatsCards() {
  const stats = [
    { label: "Global Users", value: "800" },
    { label: "Donations", value: "500" },
    { label: "Requests", value: "400" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white">
          <CardContent className="p-6 text-center">
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
