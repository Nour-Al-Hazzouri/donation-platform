"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CommunityChart() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Community Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-4xl font-bold mb-1">11,756</div>
          <div className="text-sm text-green-600">+8.2%</div>
        </div>

        {/* Chart Area */}
        <div className="relative h-48 mb-4">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M 0 150 Q 50 120 100 130 T 200 110 T 300 120 T 400 100"
              stroke="#ef4444"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M 0 150 Q 50 120 100 130 T 200 110 T 300 120 T 400 100 L 400 200 L 0 200 Z"
              fill="url(#chartGradient)"
            />
            {/* Data point for August */}
            <circle cx="200" cy="110" r="4" fill="#ef4444" />
            <line x1="200" y1="110" x2="200" y2="180" stroke="#ef4444" strokeWidth="2" />
          </svg>
        </div>

        {/* Month labels */}
        <div className="flex justify-between text-sm text-gray-500">
          <span>June</span>
          <span>July</span>
          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">August</span>
          <span>Sept</span>
          <span>Oct</span>
        </div>
      </CardContent>
    </Card>
  )
}
