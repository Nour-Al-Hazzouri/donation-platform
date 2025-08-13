"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface DashboardStats {
  total_users: number
  total_donation_events: number
  total_donation_requests: number
  total_donation_offers: number
  total_transactions: number
  total_transaction_contributions: number
  total_transaction_claims: number
  total_amount_donated: number
  active_donation_events: number
}

interface StatsCardsProps {
  token?: string // Authentication token for API calls
}

export function StatsCards({ token }: StatsCardsProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const headers: HeadersInit = {
          Accept: "application/json",
        }

        // Add authorization header if token is provided
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        const response = await fetch(`${backendUrl}/api/statistics`, {
          method: "GET",
          headers,
          mode: "cors",
          credentials: "omit",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch statistics: ${response.status}`)
        }

        const result = await response.json()

        if (result.success && result.data) {
          setStats(result.data)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch statistics")
        console.error("Error fetching dashboard statistics:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [token])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="bg-background shadow-sm border border-red-500">
            <CardContent className="p-6 text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">Loading...</div>
              <div className="text-3xl font-bold text-red-500">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Card className="bg-background shadow-sm border border-red-500 md:col-span-3">
          <CardContent className="p-6 text-center">
            <div className="text-sm font-medium text-destructive mb-2">Error loading statistics</div>
            <div className="text-sm text-muted-foreground">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const dashboardStats = [
    { label: "Global Users", value: stats?.total_users?.toLocaleString() || "0" },
    { label: "Donations", value: stats?.total_donation_events?.toLocaleString() || "0" },
    { label: "Active Events", value: stats?.active_donation_events?.toLocaleString() || "0" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {dashboardStats.map((stat, index) => (
        <Card
          key={index}
          className="bg-background shadow-sm hover:shadow transition-shadow duration-200 border border-red-500"
        >
          <CardContent className="p-6 text-center">
            <div className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-red-500">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
