import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

function argument(name, fallback) {
  const index = process.argv.indexOf(name)
  return index === -1 ? fallback : process.argv[index + 1]
}

const root = resolve(argument('--root', 'dist'))
const rawBase = argument('--base', '/southern-italy-2026/')
const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}/`
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.map', '.svg', '.webmanifest'])

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

const files = walk(root)
const textFiles = files.filter((file) => textExtensions.has(extname(file)))
const content = textFiles.map((file) => readFileSync(file, 'utf8')).join('\n')
const indexHtml = readFileSync(join(root, 'index.html'), 'utf8')
const failures = []

function requireContent(label, value) {
  if (!content.includes(value)) failures.push(`${label}: missing ${JSON.stringify(value)}`)
}

for (let day = 14; day <= 26; day += 1) {
  requireContent('calendar coverage', `2026-09-${String(day).padStart(2, '0')}`)
}

for (const place of ['Naples', 'Polignano', 'Lecce', 'Matera']) {
  requireContent('route coverage', place)
}

requireContent('outbound departure correction', '20:20')
requireContent('return departure', '07:00')

for (const placeholder of ['Get started', 'Explore Vite', 'Count is ']) {
  if (content.includes(placeholder)) failures.push(`starter content remains: ${placeholder}`)
}

const assetReferences = [...indexHtml.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)].map((match) => match[1])
for (const reference of assetReferences) {
  if (/^(?:https?:|data:)/.test(reference)) continue
  if (!reference.startsWith(base)) {
    failures.push(`asset path is not GitHub Pages base-safe: ${reference}`)
  }
}

const forbiddenPatterns = [
  { label: 'email address', pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i },
  { label: 'GitHub personal access token', pattern: /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/ },
  { label: 'private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { label: 'generic API secret assignment', pattern: /\b(?:api[_-]?key|client[_-]?secret|access[_-]?token)\s*[:=]\s*["'][^"']{12,}["']/i },
  { label: 'booking reference or PNR', pattern: /\b(?:booking reference|confirmation code|PNR)\s*[:#-]?\s*[A-Z0-9]{5,12}\b/i },
]

for (const { label, pattern } of forbiddenPatterns) {
  if (pattern.test(content)) failures.push(`privacy/security violation in built artifact: ${label}`)
}

const report = {
  artifact: root,
  base,
  checkedFiles: files.length,
  failures,
  passed: failures.length === 0,
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
if (failures.length > 0) process.exitCode = 1
