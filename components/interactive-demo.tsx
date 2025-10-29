"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { computeGreenDuration } from "@/lib/fuzzy-system"
import { TrafficSimulation } from "./traffic-simulation"
import { MembershipChart } from "./membership-chart"

export function InteractiveDemo() {
  const [vehicleDensity, setVehicleDensity] = useState(15)
  const [waitingTime, setWaitingTime] = useState(40)
  const [greenDuration, setGreenDuration] = useState(19.3)
  const [queueLength, setQueueLength] = useState(5)
  const [lightStatus, setLightStatus] = useState<"red" | "yellow" | "green">("green")
  const [controlMode, setControlMode] = useState<"adaptive" | "fixed">("adaptive")
  const [cycleTime, setCycleTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setGreenDuration((prev) => {
        const computed = controlMode === "adaptive" ? computeGreenDuration(vehicleDensity, waitingTime) : 30
        return computed
      })

      setCycleTime((prev) => {
        const greenDur = controlMode === "adaptive" ? computeGreenDuration(vehicleDensity, waitingTime) : 30
        const yellowDur = 5
        const redDur = 30
        const cycleDuration = greenDur + yellowDur + redDur
        return (prev + 1) % cycleDuration
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [vehicleDensity, waitingTime, controlMode])

  useEffect(() => {
    const greenDur = controlMode === "adaptive" ? computeGreenDuration(vehicleDensity, waitingTime) : 30
    const yellowDur = 5
    const redDur = 30

    if (cycleTime < greenDur) {
      setLightStatus("green")
    } else if (cycleTime < greenDur + yellowDur) {
      setLightStatus("yellow")
    } else {
      setLightStatus("red")
    }

    // Simulate queue changes based on light status
    setQueueLength((prev) => {
      let newQueue = prev
      if (lightStatus === "green" && prev > 0) {
        newQueue = Math.max(0, prev - 1)
      } else if (lightStatus !== "green") {
        newQueue = Math.min(prev + Math.random() * 0.5, 20)
      }
      return Math.round(newQueue)
    })
  }, [cycleTime, controlMode, vehicleDensity, waitingTime, lightStatus])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Left Column - Controls */}
      <div className="lg:col-span-1">
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Control Parameters</h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Control Mode */}
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Control Mode</label>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => setControlMode("adaptive")}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      controlMode === "adaptive"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Adaptive Fuzzy
                  </button>
                  <button
                    onClick={() => setControlMode("fixed")}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      controlMode === "fixed" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Fixed Time
                  </button>
                </div>
              </div>

              {/* Vehicle Density Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-medium">Vehicle Density: {vehicleDensity} cars/min</label>
                </div>
                <Slider
                  value={[vehicleDensity]}
                  onValueChange={(value) => setVehicleDensity(value[0])}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                </div>
              </div>

              {/* Waiting Time Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-medium">Waiting Time: {waitingTime} seconds</label>
                </div>
                <Slider
                  value={[waitingTime]}
                  onValueChange={(value) => setWaitingTime(value[0])}
                  min={0}
                  max={120}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>60</span>
                  <span>120</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Green Light Duration Result */}
          <Card className="p-4 sm:p-6 bg-blue-50">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Green Light Duration</h3>
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">{greenDuration.toFixed(1)}s</div>
            <p className="text-xs sm:text-sm text-gray-600">
              {controlMode === "adaptive" ? "Computed by fuzzy logic" : "Fixed time control"}
            </p>
          </Card>
        </div>
      </div>

      {/* Right Column - Visualization */}
      <div className="lg:col-span-2 space-y-6 sm:space-y-8">
        <TrafficSimulation
          queueLength={queueLength}
          lightStatus={lightStatus}
          greenDuration={greenDuration}
          controlMode={controlMode}
        />
        <MembershipChart vehicleDensity={vehicleDensity} waitingTime={waitingTime} />
      </div>
    </div>
  )
}
