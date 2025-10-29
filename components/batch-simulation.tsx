"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { TrafficSimulator } from "@/lib/simulator"

interface SimulationResult {
  adaptive: {
    averageQueueLength: number
    totalServedVehicles: number
    averageWaitingTime: number
    throughput: number
  }
  fixed: {
    averageQueueLength: number
    totalServedVehicles: number
    averageWaitingTime: number
    throughput: number
  }
  improvement: {
    queueReduction: number
    throughputIncrease: number
    waitingTimeReduction: number
  }
}

export function BatchSimulation() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<SimulationResult | null>(null)

  const runSimulation = async () => {
    setIsRunning(true)

    const duration = 300
    const arrivalRate = 25

    const adaptiveSimulator = new TrafficSimulator(true)
    const fixedSimulator = new TrafficSimulator(false)

    const adaptiveResult = adaptiveSimulator.simulate(duration, arrivalRate)
    const fixedResult = fixedSimulator.simulate(duration, arrivalRate)

    const improvement = {
      queueReduction:
        ((fixedResult.metrics.averageQueueLength - adaptiveResult.metrics.averageQueueLength) /
          fixedResult.metrics.averageQueueLength) *
        100,
      throughputIncrease:
        ((adaptiveResult.metrics.throughput - fixedResult.metrics.throughput) / fixedResult.metrics.throughput) * 100,
      waitingTimeReduction:
        ((fixedResult.metrics.averageWaitingTime - adaptiveResult.metrics.averageWaitingTime) /
          fixedResult.metrics.averageWaitingTime) *
        100,
    }

    setResults({
      adaptive: adaptiveResult.metrics,
      fixed: fixedResult.metrics,
      improvement,
    })

    setIsRunning(false)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Simulation Comparison</h2>

        <div className="flex justify-center mb-6 sm:mb-8">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 text-sm sm:text-base"
          >
            {isRunning ? "Running Simulation..." : "Run 5-Minute Simulation"}
          </button>
        </div>

        {!results && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Ready to Simulate</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Click the button above to run a 5-minute traffic simulation comparing adaptive fuzzy control vs fixed-time
              control.
            </p>
          </div>
        )}

        {results && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Adaptive Results */}
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3 sm:mb-4 text-sm sm:text-base">
                  Adaptive Fuzzy Control
                </h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Avg Queue Length:</span>
                    <span className="font-semibold">{results.adaptive.averageQueueLength.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Vehicles Served:</span>
                    <span className="font-semibold">{results.adaptive.totalServedVehicles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Avg Waiting Time:</span>
                    <span className="font-semibold">{results.adaptive.averageWaitingTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Throughput:</span>
                    <span className="font-semibold">{results.adaptive.throughput.toFixed(1)} veh/min</span>
                  </div>
                </div>
              </div>

              {/* Fixed Time Results */}
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Fixed-Time Control</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Avg Queue Length:</span>
                    <span className="font-semibold">{results.fixed.averageQueueLength.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Vehicles Served:</span>
                    <span className="font-semibold">{results.fixed.totalServedVehicles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Avg Waiting Time:</span>
                    <span className="font-semibold">{results.fixed.averageWaitingTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Throughput:</span>
                    <span className="font-semibold">{results.fixed.throughput.toFixed(1)} veh/min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Metrics */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-green-900 mb-3 sm:mb-4 text-sm sm:text-base">
                Performance Improvement
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-700">Queue Reduction:</span>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {results.improvement.queueReduction.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-700">Throughput Increase:</span>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {results.improvement.throughputIncrease.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-700">Waiting Time Reduction:</span>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {results.improvement.waitingTimeReduction.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
