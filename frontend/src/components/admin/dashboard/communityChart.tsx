"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CommunityChart() {
  return (
    <Card className="bg-white w-full h-full flex flex-col">
      <CardHeader className="text-center pb-2"> {/* Reduced padding-bottom */}
        <CardTitle className="text-lg font-medium">Community Members</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Stats section with reduced margin-bottom */}
        <div className="mb-2 text-center"> {/* Changed from mb-4 to mb-2 */}
          <div className="text-4xl font-bold">11,756</div> {/* Removed mb-1 */}
          <div className="text-sm text-green-600 mt-1">+8.2%</div> {/* Changed to mt-1 */}
        </div>

        {/* Chart Area - moved closer to stats */}
        <div className="relative flex-1 min-h-[200px]"> {/* Removed mb-2 */}
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
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
        <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-auto pt-2"> {/* Added pt-2 */}
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