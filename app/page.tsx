"use client"

import { useState } from "react"
import { BatchSimulation } from "@/components/batch-simulation"
import { InteractiveDemo } from "@/components/interactive-demo"

export default function Home() {
  const [vehicleDensity, setVehicleDensity] = useState(15)
  const [waitingTime, setWaitingTime] = useState(40)
  const [greenDuration, setGreenDuration] = useState(19.3)
  const [queueLength, setQueueLength] = useState(5)
  const [lightStatus, setLightStatus] = useState<"red" | "yellow" | "green">("green")
  const [activeTab, setActiveTab] = useState<"demo" | "batch">("demo")
  const [controlMode, setControlMode] = useState<"adaptive" | "fixed">("adaptive")

  const handleParametersChange = (density: number, waiting: number, green: number) => {
    setVehicleDensity(density)
    setWaitingTime(waiting)
    setGreenDuration(green)
    setQueueLength(Math.round(density / 3))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Fuzzy Logic Traffic Control System</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Intelligent two-way traffic management using Mamdani fuzzy inference
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full flex-shrink-0">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs sm:text-sm font-medium text-green-800">System Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 sm:gap-8">
            <button
              onClick={() => setActiveTab("demo")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "demo"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Interactive Demo
            </button>
            <button
              onClick={() => setActiveTab("batch")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "batch"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Batch Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "demo" && <InteractiveDemo />}

        {activeTab === "batch" && <BatchSimulation />}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 text-xs sm:text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900 mb-2">© 2025 Fuzzy Logic Traffic Control System</p>
              <p>Implementing Mamdani inference for intelligent traffic management.</p>
            </div>
            <div className="sm:text-right">
              <p className="font-semibold text-gray-900 mb-2">Simulation Parameters:</p>
              <p>5min duration, 0-50 veh/min arrival rate</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
