"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

interface CommunityChartProps {
  token?: string // Authentication token for API calls
}

export function CommunityChart({ token }: CommunityChartProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const headers: HeadersInit = { Accept: "application/json" }
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
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [token])

  // Calculate values from stats
  const totalMembers = stats?.total_users?.toLocaleString() || "0"
  const growthRate = stats?.total_users
    ? `+${Math.round((stats.active_donation_events / stats.total_users) * 100)}%`
    : "+0%"
  const growthPeriod = "based on active events"

  // For now, chart is a placeholder curve — replace when backend provides historical growth
  const chartPath = "M 0 150 Q 50 120 100 130 T 200 110 T 300 120 T 400 100"
  const chartFillPath = `${chartPath} L 400 200 L 0 200 Z`

  return (
    <Card className="bg-background w-full shadow-sm hover:shadow transition-shadow duration-200 border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Community Growth</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="text-center text-destructive">{error}</div>
        ) : (
          <>
            {/* Stats section */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl font-bold">{totalMembers}</div>
                <div className="text-sm text-muted-foreground">Total Members</div>
              </div>
              <div className="text-sm font-medium text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full">
                {growthRate} {growthPeriod}
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-[250px] md:h-[300px] w-full mt-4">
              <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d={chartPath} stroke="#ef4444" strokeWidth="3" fill="none" />
                <path d={chartFillPath} fill="url(#chartGradient)" />
              </svg>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
