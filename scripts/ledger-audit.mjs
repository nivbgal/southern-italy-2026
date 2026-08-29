import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ledgerPath = resolve(process.argv[2] ?? 'qa/commitment-ledger.json')
const allowPending = process.argv.includes('--allow-pending')
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'))
const finalStatuses = new Set([
  'implemented',
  'verified_existing',
  'excluded_approved',
  'blocked_disclosed',
])
const failures = []

if (!ledger.deliverable_id) failures.push('deliverable_id is required')
if (!ledger.final_artifact) failures.push('final_artifact is required')
if (!Array.isArray(ledger.requirements) || ledger.requirements.length === 0) {
  failures.push('requirements must be a non-empty array')
}

const ids = new Set()
for (const requirement of ledger.requirements ?? []) {
  if (!requirement.id) failures.push('a requirement is missing its stable id')
  if (ids.has(requirement.id)) failures.push(`duplicate requirement id: ${requirement.id}`)
  ids.add(requirement.id)

  if (!requirement.requirement || !requirement.source || !requirement.destination) {
    failures.push(`${requirement.id}: requirement, source, and destination are required`)
  }

  if (!finalStatuses.has(requirement.status)) {
    if (!(allowPending && requirement.status === 'planned')) {
      failures.push(`${requirement.id}: invalid or unfinished status ${JSON.stringify(requirement.status)}`)
    }
    continue
  }

  if (['implemented', 'verified_existing'].includes(requirement.status)) {
    if (!Array.isArray(requirement.evidence) || requirement.evidence.length === 0) {
      failures.push(`${requirement.id}: implemented/existing status requires evidence`)
    }
  }
  if (requirement.status === 'excluded_approved' && !requirement.approval) {
    failures.push(`${requirement.id}: excluded_approved requires explicit approval`)
  }
  if (requirement.status === 'blocked_disclosed' && !requirement.disclosure) {
    failures.push(`${requirement.id}: blocked_disclosed requires a disclosure`)
  }
}

const result = {
  ledger: ledgerPath,
  requirementCount: ledger.requirements?.length ?? 0,
  failures,
  passed: failures.length === 0,
}

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
if (failures.length > 0) process.exitCode = 1
