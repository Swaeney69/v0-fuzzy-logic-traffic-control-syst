"use client"

import { Card } from "@/components/ui/card"

interface TrafficSimulationProps {
  queueLength: number
  lightStatus: "red" | "yellow" | "green"
  greenDuration: number
  controlMode: "adaptive" | "fixed"
}

export function TrafficSimulation({ queueLength, lightStatus, greenDuration, controlMode }: TrafficSimulationProps) {
  const getLightColor = () => {
    switch (lightStatus) {
      case "red":
        return "bg-red-500 shadow-red-500/50"
      case "yellow":
        return "bg-yellow-400 shadow-yellow-400/50"
      case "green":
        return "bg-green-500 shadow-green-500/50"
    }
  }

  const getStatusText = () => {
    switch (lightStatus) {
      case "red":
        return "RED"
      case "yellow":
        return "YELLOW"
      case "green":
        return "GREEN"
    }
  }

  const carPositions = Array.from({ length: Math.min(queueLength, 12) }).map((_, i) => ({
    id: i,
    delay: i * 0.1,
    offset: i * 35,
  }))

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Traffic Simulation</h2>

      <div className="space-y-4 sm:space-y-6">
        {/* Info Box */}
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 sm:p-4">
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <div>
              <span className="font-medium">Queue Length:</span> {queueLength} vehicles
            </div>
            <div>
              <span className="font-medium">Light Status:</span> <span className="font-bold">{getStatusText()}</span>
            </div>
            <div>
              <span className="font-medium">Green Duration:</span> {greenDuration.toFixed(1)}s
            </div>
            <div>
              <span className="font-medium">Mode:</span> {controlMode === "adaptive" ? "Adaptive Fuzzy" : "Fixed Time"}
            </div>
          </div>
        </div>

        {/* Road Visualization */}
        <div className="space-y-3 sm:space-y-4">
          {/* Traffic Light */}
          <div className="flex justify-end mb-2 sm:mb-4">
            <div className="flex flex-col gap-2 bg-gray-800 p-2 sm:p-3 rounded-lg">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${getLightColor()} shadow-lg transition-all duration-300 ${
                  lightStatus === "green" ? "shadow-2xl" : ""
                }`}
              />
            </div>
          </div>

          {/* Road Container */}
          <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-4 sm:p-6 overflow-hidden">
            {/* Road markings */}
            <div className="flex gap-2 sm:gap-3 justify-center mb-4 sm:mb-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-1 sm:gap-2">
                  <div className="w-6 sm:w-8 h-1 sm:h-1.5 bg-yellow-300 rounded-full" />
                  <div className="w-2 sm:w-3 h-1 sm:h-1.5 bg-gray-700" />
                </div>
              ))}
            </div>

            <div className="relative bg-gray-600 rounded-lg p-3 sm:p-4 h-24 sm:h-32 overflow-hidden border-2 border-gray-500">
              {/* Animated cars */}
              <div className="relative h-full">
                {carPositions.map((car) => (
                  <div
                    key={car.id}
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
                    style={{
                      left: lightStatus === "green" ? `calc(100% - 40px)` : `${car.offset}px`,
                      animation: lightStatus === "green" ? `none` : `bounce 2s ease-in-out infinite`,
                      animationDelay: `${car.delay}s`,
                    }}
                  >
                    {/* Car body */}
                    <div className="w-8 h-5 sm:w-10 sm:h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-md border-2 border-red-700 shadow-lg relative">
                      {/* Windows */}
                      <div className="absolute top-1 left-1 w-2 h-2 bg-blue-300 rounded-sm" />
                      <div className="absolute top-1 right-1 w-2 h-2 bg-blue-300 rounded-sm" />
                      {/* Wheels */}
                      <div className="absolute -bottom-1 left-1 w-1.5 h-1.5 bg-gray-900 rounded-full" />
                      <div className="absolute -bottom-1 right-1 w-1.5 h-1.5 bg-gray-900 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Queue indicator */}
              {queueLength > 12 && (
                <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  +{queueLength - 12}
                </div>
              )}
            </div>

            {/* Grass area */}
            <div className="mt-4 sm:mt-6 bg-gradient-to-b from-green-300 to-green-400 rounded-lg h-12 sm:h-16 border-2 border-green-500" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </Card>
  )
}
