import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const reportPath = resolve(process.argv[2] ?? 'qa/verification-report.json')
const report = JSON.parse(readFileSync(reportPath, 'utf8'))
const threshold = Number(report.threshold ?? 0.95)
const failures = []

if (!Array.isArray(report.categories) || report.categories.length === 0) {
  failures.push('verification categories are required')
}

const weightTotal = (report.categories ?? []).reduce(
  (total, category) => total + Number(category.weight ?? 0),
  0,
)
if (Math.abs(weightTotal - 1) > 0.0001) failures.push(`category weights total ${weightTotal}, expected 1`)

let weightedScore = 0
for (const category of report.categories ?? []) {
  if (typeof category.score !== 'number') {
    failures.push(`${category.id}: score is pending`)
    continue
  }
  if (category.score < threshold) {
    failures.push(`${category.id}: ${category.score.toFixed(3)} is below ${threshold.toFixed(2)}`)
  }
  if (!Array.isArray(category.evidence) || category.evidence.length === 0) {
    failures.push(`${category.id}: evidence is required`)
  }
  weightedScore += Number(category.weight) * category.score
}

const activeBlockers = (report.hardBlockers ?? []).filter((blocker) => blocker.active)
for (const blocker of activeBlockers) failures.push(`hard blocker ${blocker.id}: ${blocker.description}`)
if (weightedScore < threshold) {
  failures.push(`weighted truth score ${weightedScore.toFixed(3)} is below ${threshold.toFixed(2)}`)
}

const result = {
  report: reportPath,
  threshold,
  weightedScore: Number(weightedScore.toFixed(3)),
  activeBlockers: activeBlockers.length,
  failures,
  passed: failures.length === 0,
}

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
if (failures.length > 0) process.exitCode = 1
