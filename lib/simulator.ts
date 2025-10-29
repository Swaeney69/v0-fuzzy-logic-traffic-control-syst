import { computeGreenDuration } from "./fuzzy-system"

export interface SimulationState {
  time: number
  queueLength: number
  arrivalRate: number
  lightStatus: "red" | "yellow" | "green"
  greenDuration: number
  servedVehicles: number
  totalWaitingTime: number
}

export interface SimulationMetrics {
  averageQueueLength: number
  totalServedVehicles: number
  averageWaitingTime: number
  throughput: number
}

export class TrafficSimulator {
  private queueLength = 0
  private servedVehicles = 0
  private totalWaitingTime = 0
  private lightStatus: "red" | "yellow" | "green" = "red"
  private cycleTime = 0
  private greenDuration = 30
  private yellowDuration = 5
  private redDuration = 30
  private vehicleWaitingTimes: number[] = []
  private isAdaptive = true

  constructor(isAdaptive = true) {
    this.isAdaptive = isAdaptive
  }

  private getArrivalRate(): number {
    // Random arrival rate between 0-50 vehicles/min
    return Math.random() * 50
  }

  private updateLightStatus(time: number): void {
    if (this.isAdaptive) {
      // Adaptive mode: cycle based on computed green duration
      const cycleDuration = this.greenDuration + this.yellowDuration + this.redDuration

      if (this.cycleTime < this.greenDuration) {
        this.lightStatus = "green"
      } else if (this.cycleTime < this.greenDuration + this.yellowDuration) {
        this.lightStatus = "yellow"
      } else {
        this.lightStatus = "red"
      }

      this.cycleTime = (this.cycleTime + 1) % cycleDuration
    } else {
      // Fixed mode: 30s green + 5s yellow + 30s red
      const cycleDuration = 65
      const position = time % cycleDuration

      if (position < 30) {
        this.lightStatus = "green"
      } else if (position < 35) {
        this.lightStatus = "yellow"
      } else {
        this.lightStatus = "red"
      }
    }
  }

  private processArrivals(arrivalRate: number): void {
    // Poisson arrival process
    const expectedArrivals = arrivalRate / 60 // Convert per minute to per second
    const arrivals = Math.random() < expectedArrivals ? 1 : 0
    this.queueLength += arrivals
  }

  private processDepartures(): void {
    // Vehicles depart during green light
    if (this.lightStatus === "green" && this.queueLength > 0) {
      // Service rate: 1 vehicle per second during green
      this.queueLength -= 1
      this.servedVehicles += 1
      this.vehicleWaitingTimes.push(1) // Simplified: 1 second service time
    }

    // Update waiting times for vehicles still in queue
    if (this.queueLength > 0) {
      for (let i = 0; i < this.queueLength; i++) {
        this.totalWaitingTime += 1
      }
    }
  }

  private computeAdaptiveGreen(): void {
    if (this.isAdaptive) {
      // Compute green duration based on current queue and waiting time
      const waitingTime = this.queueLength > 0 ? Math.min(this.totalWaitingTime / this.queueLength, 120) : 0
      this.greenDuration = computeGreenDuration(this.queueLength, waitingTime)
      this.redDuration = 65 - this.greenDuration - this.yellowDuration
    }
  }

  step(arrivalRate: number): SimulationState {
    this.updateLightStatus(0)
    this.processArrivals(arrivalRate)
    this.processDepartures()
    this.computeAdaptiveGreen()

    return {
      time: 0,
      queueLength: this.queueLength,
      arrivalRate,
      lightStatus: this.lightStatus,
      greenDuration: this.greenDuration,
      servedVehicles: this.servedVehicles,
      totalWaitingTime: this.totalWaitingTime,
    }
  }

  simulate(duration: number, arrivalRate: number): { states: SimulationState[]; metrics: SimulationMetrics } {
    const states: SimulationState[] = []
    this.queueLength = 0
    this.servedVehicles = 0
    this.totalWaitingTime = 0
    this.cycleTime = 0

    for (let time = 0; time < duration; time++) {
      this.updateLightStatus(time)
      this.processArrivals(arrivalRate)
      this.processDepartures()
      this.computeAdaptiveGreen()

      states.push({
        time,
        queueLength: this.queueLength,
        arrivalRate,
        lightStatus: this.lightStatus,
        greenDuration: this.greenDuration,
        servedVehicles: this.servedVehicles,
        totalWaitingTime: this.totalWaitingTime,
      })
    }

    const metrics: SimulationMetrics = {
      averageQueueLength: states.reduce((sum, s) => sum + s.queueLength, 0) / states.length,
      totalServedVehicles: this.servedVehicles,
      averageWaitingTime: this.servedVehicles > 0 ? this.totalWaitingTime / this.servedVehicles : 0,
      throughput: (this.servedVehicles / duration) * 60, // vehicles per minute
    }

    return { states, metrics }
  }
}
