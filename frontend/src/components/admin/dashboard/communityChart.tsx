"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for community growth chart
const COMMUNITY_GROWTH = {
  totalMembers: "11,756",
  growthRate: "+8.2%",
  growthPeriod: "from last month",
  chartPath: "M 0 150 Q 50 120 100 130 T 200 110 T 300 120 T 400 100",
  chartFillPath: "M 0 150 Q 50 120 100 130 T 200 110 T 300 120 T 400 100 L 400 200 L 0 200 Z",
  dataPoint: { x: 200, y: 110 },
  months: [
    { name: "June", isHighlighted: false },
    { name: "July", isHighlighted: false },
    { name: "August", isHighlighted: true },
    { name: "Sept", isHighlighted: false },
    { name: "Oct", isHighlighted: false }
  ]
}

export function CommunityChart() {
  return (
    <Card className="bg-background w-full shadow-sm hover:shadow transition-shadow duration-200 border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Community Growth</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-4xl font-bold">{COMMUNITY_GROWTH.totalMembers}</div>
            <div className="text-sm text-muted-foreground">Total Members</div>
          </div>
          <div className="text-sm font-medium text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full">
            {COMMUNITY_GROWTH.growthRate} {COMMUNITY_GROWTH.growthPeriod}
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
            <path
              d={COMMUNITY_GROWTH.chartPath}
              stroke="#ef4444"
              strokeWidth="3"
              fill="none"
            />
            <path
              d={COMMUNITY_GROWTH.chartFillPath}
              fill="url(#chartGradient)"
            />
            {/* Data point for highlighted month */}
            <circle 
              cx={COMMUNITY_GROWTH.dataPoint.x} 
              cy={COMMUNITY_GROWTH.dataPoint.y} 
              r="4" 
              fill="#ef4444" 
            />
            <line 
              x1={COMMUNITY_GROWTH.dataPoint.x} 
              y1={COMMUNITY_GROWTH.dataPoint.y} 
              x2={COMMUNITY_GROWTH.dataPoint.x} 
              y2="180" 
              stroke="#ef4444" 
              strokeWidth="2" 
              strokeDasharray="2" 
            />
          </svg>
        </div>

        {/* Month labels */}
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          {COMMUNITY_GROWTH.months.map((month, index) => (
            <span 
              key={index} 
              className={month.isHighlighted ? "bg-red-500/10 text-red-500 px-2 py-0.5 rounded-md font-medium" : ""}
            >
              {month.name}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}