"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { computeGreenDuration } from "@/lib/fuzzy-system"

interface ControlParametersProps {
  onParametersChange: (density: number, waitingTime: number, greenDuration: number) => void
  controlMode: "adaptive" | "fixed"
  onControlModeChange: (mode: "adaptive" | "fixed") => void
}

export function ControlParameters({ onParametersChange, controlMode, onControlModeChange }: ControlParametersProps) {
  const [vehicleDensity, setVehicleDensity] = useState(15)
  const [waitingTime, setWaitingTime] = useState(40)
  const [greenDuration, setGreenDuration] = useState(19.3)

  useEffect(() => {
    const computed = controlMode === "adaptive" ? computeGreenDuration(vehicleDensity, waitingTime) : 30
    setGreenDuration(computed)
    onParametersChange(vehicleDensity, waitingTime, computed)
  }, [vehicleDensity, waitingTime, controlMode, onParametersChange])

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Control Parameters</h2>

        <div className="space-y-4 sm:space-y-6">
          {/* Control Mode */}
          <div>
            <label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">Control Mode</label>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => onControlModeChange("adaptive")}
                className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  controlMode === "adaptive" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Adaptive Fuzzy
              </button>
              <button
                onClick={() => onControlModeChange("fixed")}
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
  )
}
