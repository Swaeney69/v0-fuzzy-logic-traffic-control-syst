/**
 * Fuzzy Logic Traffic Control System
 * Implements Mamdani fuzzy inference for adaptive traffic light control
 */

// Membership function types
type MembershipFunction = (value: number) => number

// Trapezoidal membership function
function trapezoid(a: number, b: number, c: number, d: number): MembershipFunction {
  return (x: number) => {
    if (x <= a || x >= d) return 0
    if (x >= b && x <= c) return 1
    if (x > a && x < b) return (x - a) / (b - a)
    return (d - x) / (d - c)
  }
}

// Triangular membership function
function triangle(a: number, b: number, c: number): MembershipFunction {
  return (x: number) => {
    if (x <= a || x >= c) return 0
    if (x === b) return 1
    if (x > a && x < b) return (x - a) / (b - a)
    return (c - x) / (c - b)
  }
}

// Define input universes
const densityLow = trapezoid(0, 0, 5, 10)
const densityMedium = triangle(5, 15, 25)
const densityHigh = trapezoid(20, 35, 50, 50)

const waitingShort = trapezoid(0, 0, 10, 30)
const waitingMedium = triangle(20, 40, 60)
const waitingLong = trapezoid(50, 75, 120, 120)

// Define output universe
const greenShort = trapezoid(0, 5, 10, 15)
const greenMedium = triangle(10, 18, 30)
const greenLong = trapezoid(25, 40, 60, 60)

// Fuzzy rule evaluation (Mamdani inference)
interface FuzzyRule {
  densityMembership: MembershipFunction
  waitingMembership: MembershipFunction
  outputMembership: MembershipFunction
}

const fuzzyRules: FuzzyRule[] = [
  // Rule 1: IF density Low AND waiting Short → green Short
  { densityMembership: densityLow, waitingMembership: waitingShort, outputMembership: greenShort },
  // Rule 2: IF density Low AND waiting Medium → green Short
  { densityMembership: densityLow, waitingMembership: waitingMedium, outputMembership: greenShort },
  // Rule 3: IF density Low AND waiting Long → green Medium
  { densityMembership: densityLow, waitingMembership: waitingLong, outputMembership: greenMedium },
  // Rule 4: IF density Medium AND waiting Short → green Short
  { densityMembership: densityMedium, waitingMembership: waitingShort, outputMembership: greenShort },
  // Rule 5: IF density Medium AND waiting Medium → green Medium
  { densityMembership: densityMedium, waitingMembership: waitingMedium, outputMembership: greenMedium },
  // Rule 6: IF density Medium AND waiting Long → green Long
  { densityMembership: densityMedium, waitingMembership: waitingLong, outputMembership: greenLong },
  // Rule 7: IF density High AND waiting Short → green Medium
  { densityMembership: densityHigh, waitingMembership: waitingShort, outputMembership: greenMedium },
  // Rule 8: IF density High AND waiting Medium → green Long
  { densityMembership: densityHigh, waitingMembership: waitingMedium, outputMembership: greenLong },
  // Rule 9: IF density High AND waiting Long → green Long
  { densityMembership: densityHigh, waitingMembership: waitingLong, outputMembership: greenLong },
]

// Centroid defuzzification
function defuzzify(outputValues: number[]): number {
  const resolution = 1000
  let numerator = 0
  let denominator = 0

  for (let i = 0; i < resolution; i++) {
    const y = (i / resolution) * 60 // Output range 0-60 seconds
    let membershipValue = 0

    // Find max membership across all rules
    for (const value of outputValues) {
      membershipValue = Math.max(membershipValue, value)
    }

    numerator += y * membershipValue
    denominator += membershipValue
  }

  return denominator === 0 ? 30 : numerator / denominator
}

// Main fuzzy inference function
export function computeGreenDuration(vehicleDensity: number, waitingTime: number): number {
  // Fuzzification: evaluate membership for inputs
  const densityMemberships = {
    low: densityLow(vehicleDensity),
    medium: densityMedium(vehicleDensity),
    high: densityHigh(vehicleDensity),
  }

  const waitingMemberships = {
    short: waitingShort(waitingTime),
    medium: waitingMedium(waitingTime),
    long: waitingLong(waitingTime),
  }

  // Rule evaluation and aggregation
  const outputMemberships: number[] = []

  for (const rule of fuzzyRules) {
    const antecedent = Math.min(rule.densityMembership(vehicleDensity), rule.waitingMembership(waitingTime))
    outputMemberships.push(antecedent)
  }

  // Defuzzification using centroid method
  let numerator = 0
  let denominator = 0

  for (let y = 0; y <= 60; y += 0.1) {
    let membershipValue = 0

    // Evaluate each rule's output membership at this y value
    for (let i = 0; i < fuzzyRules.length; i++) {
      const ruleFiringStrength = outputMemberships[i]
      const outputMembership = fuzzyRules[i].outputMembership(y)
      membershipValue = Math.max(membershipValue, Math.min(ruleFiringStrength, outputMembership))
    }

    numerator += y * membershipValue
    denominator += membershipValue
  }

  const result = denominator === 0 ? 30 : numerator / denominator
  return Math.round(result * 10) / 10 // Round to 1 decimal
}

// Get membership values for visualization
export function getMembershipValues(vehicleDensity: number, waitingTime: number) {
  return {
    density: {
      low: densityLow(vehicleDensity),
      medium: densityMedium(vehicleDensity),
      high: densityHigh(vehicleDensity),
    },
    waiting: {
      short: waitingShort(waitingTime),
      medium: waitingMedium(waitingTime),
      long: waitingLong(waitingTime),
    },
  }
}
