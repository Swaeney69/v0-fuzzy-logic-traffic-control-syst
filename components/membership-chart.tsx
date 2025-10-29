"use client"

import { Card } from "@/components/ui/card"
import { getMembershipValues } from "@/lib/fuzzy-system"

interface MembershipChartProps {
  vehicleDensity: number
  waitingTime: number
}

export function MembershipChart({ vehicleDensity, waitingTime }: MembershipChartProps) {
  const memberships = getMembershipValues(vehicleDensity, waitingTime)

  const renderDensityChart = () => {
    const width = 280
    const height = 150
    const padding = 30
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Normalize density to 0-50 range
    const normalizedDensity = (vehicleDensity / 50) * chartWidth

    return (
      <svg width={width} height={height} className="w-full border border-gray-300 rounded-lg bg-white">
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="1" />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* Low membership triangle */}
        <polygon
          points={`${padding},${height - padding} ${padding + chartWidth * 0.25},${height - padding} ${padding + chartWidth * 0.15},${padding}`}
          fill="#fbbf24"
          opacity="0.3"
          stroke="#f59e0b"
          strokeWidth="2"
        />

        {/* Medium membership triangle */}
        <polygon
          points={`${padding + chartWidth * 0.25},${height - padding} ${padding + chartWidth * 0.75},${height - padding} ${padding + chartWidth * 0.5},${padding}`}
          fill="#60a5fa"
          opacity="0.3"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* High membership triangle */}
        <polygon
          points={`${padding + chartWidth * 0.75},${height - padding} ${width - padding},${height - padding} ${width - padding - chartWidth * 0.15},${padding}`}
          fill="#34d399"
          opacity="0.3"
          stroke="#10b981"
          strokeWidth="2"
        />

        {/* Input line */}
        <line
          x1={padding + normalizedDensity}
          y1={padding}
          x2={padding + normalizedDensity}
          y2={height - padding}
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Labels */}
        <text x={padding + 5} y={height - padding + 20} fontSize="12" fill="#666">
          Low
        </text>
        <text x={padding + chartWidth * 0.5 - 15} y={height - padding + 20} fontSize="12" fill="#666">
          Medium
        </text>
        <text x={width - padding - 30} y={height - padding + 20} fontSize="12" fill="#666">
          High
        </text>

        {/* Y-axis label */}
        <text x={10} y={padding - 5} fontSize="11" fill="#999">
          1.0
        </text>
        <text x={10} y={height - padding + 5} fontSize="11" fill="#999">
          0.0
        </text>

        {/* X-axis labels */}
        <text x={padding - 10} y={height - padding + 20} fontSize="11" fill="#999">
          0
        </text>
        <text x={width - padding - 10} y={height - padding + 20} fontSize="11" fill="#999">
          50
        </text>
      </svg>
    )
  }

  const renderWaitingTimeChart = () => {
    const width = 280
    const height = 150
    const padding = 30
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Normalize waiting time to 0-120 range
    const normalizedWaitingTime = (waitingTime / 120) * chartWidth

    return (
      <svg width={width} height={height} className="w-full border border-gray-300 rounded-lg bg-white">
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" strokeWidth="1" />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* Short membership triangle */}
        <polygon
          points={`${padding},${height - padding} ${padding + chartWidth * 0.25},${height - padding} ${padding + chartWidth * 0.15},${padding}`}
          fill="#fbbf24"
          opacity="0.3"
          stroke="#f59e0b"
          strokeWidth="2"
        />

        {/* Medium membership triangle */}
        <polygon
          points={`${padding + chartWidth * 0.25},${height - padding} ${padding + chartWidth * 0.75},${height - padding} ${padding + chartWidth * 0.5},${padding}`}
          fill="#60a5fa"
          opacity="0.3"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Long membership triangle */}
        <polygon
          points={`${padding + chartWidth * 0.75},${height - padding} ${width - padding},${height - padding} ${width - padding - chartWidth * 0.15},${padding}`}
          fill="#34d399"
          opacity="0.3"
          stroke="#10b981"
          strokeWidth="2"
        />

        {/* Input line */}
        <line
          x1={padding + normalizedWaitingTime}
          y1={padding}
          x2={padding + normalizedWaitingTime}
          y2={height - padding}
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Labels */}
        <text x={padding + 5} y={height - padding + 20} fontSize="12" fill="#666">
          Short
        </text>
        <text x={padding + chartWidth * 0.5 - 20} y={height - padding + 20} fontSize="12" fill="#666">
          Medium
        </text>
        <text x={width - padding - 25} y={height - padding + 20} fontSize="12" fill="#666">
          Long
        </text>

        {/* Y-axis label */}
        <text x={10} y={padding - 5} fontSize="11" fill="#999">
          1.0
        </text>
        <text x={10} y={height - padding + 5} fontSize="11" fill="#999">
          0.0
        </text>

        {/* X-axis labels */}
        <text x={padding - 10} y={height - padding + 20} fontSize="11" fill="#999">
          0
        </text>
        <text x={width - padding - 15} y={height - padding + 20} fontSize="11" fill="#999">
          120
        </text>
      </svg>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {/* Density Membership */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold mb-4 sm:mb-6">Vehicle Density Membership</h3>
        <div className="space-y-4">
          {renderDensityChart()}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-amber-600">{(memberships.density.low * 100).toFixed(0)}%</div>
              <div className="text-gray-600">Low</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{(memberships.density.medium * 100).toFixed(0)}%</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">{(memberships.density.high * 100).toFixed(0)}%</div>
              <div className="text-gray-600">High</div>
            </div>
          </div>
          <div className="text-xs text-red-600 font-medium">Input: {vehicleDensity} cars/min</div>
        </div>
      </Card>

      {/* Waiting Time Membership */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold mb-4 sm:mb-6">Waiting Time Membership</h3>
        <div className="space-y-4">
          {renderWaitingTimeChart()}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-amber-600">{(memberships.waiting.short * 100).toFixed(0)}%</div>
              <div className="text-gray-600">Short</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{(memberships.waiting.medium * 100).toFixed(0)}%</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">{(memberships.waiting.long * 100).toFixed(0)}%</div>
              <div className="text-gray-600">Long</div>
            </div>
          </div>
          <div className="text-xs text-red-600 font-medium">Input: {waitingTime} seconds</div>
        </div>
      </Card>
    </div>
  )
}
