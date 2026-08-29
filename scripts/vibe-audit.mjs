import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const read = (path) => readFileSync(resolve(root, path), 'utf8')
const styles = read('src/styles.css')
const packageJson = read('package.json')
const packageLock = read('package-lock.json')
const publicSource = [
  'index.html',
  'vite.config.ts',
  'public/favicon.svg',
  'src/App.tsx',
  'src/components/Layout.tsx',
  'src/components/RouteMap.tsx',
  'src/components/Timeline.tsx',
  'src/components/WeatherPanel.tsx',
  'src/data/trip.ts',
  'src/pages/AboutPage.tsx',
  'src/pages/BookingsPage.tsx',
  'src/pages/BudgetPage.tsx',
  'src/pages/DayPage.tsx',
  'src/pages/MapPage.tsx',
  'src/pages/OverviewPage.tsx',
  'src/pages/PrivacyPage.tsx',
  'src/pages/TermsPage.tsx',
].map(read).join('\n')

const failures = []
const reject = (name, value, pattern) => {
  if (pattern.test(value)) failures.push(name)
}
const requirePattern = (name, value, pattern) => {
  if (!pattern.test(value)) failures.push(name)
}

reject('active stylesheet contains a gradient', styles, /(?:linear|radial|conic)-gradient/i)
reject('active stylesheet contains a decorative shadow', styles, /(?:box-shadow|drop-shadow)/i)
reject('active stylesheet contains a glass blur', styles, /(?:backdrop-filter|background-blend-mode)/i)
reject('active stylesheet contains a colored left stripe', styles, /border-left\s*:/i)
reject('active stylesheet contains a three-column feature pattern', styles, /repeat\(3\s*,/i)
reject('active stylesheet contains a pill radius', styles, /border-radius\s*:\s*(?:999|900)px/i)
reject('active stylesheet contains a banned typeface', styles, /\b(?:Inter|Geist|Space Grotesk)\b/i)
reject('active stylesheet contains the old violet or neon palette', styles, /#(?:483cff|3528db|d7ffc2|0bff80)\b/i)
reject('active stylesheet contains hover motion', styles, /:hover[^{}]*\{[^{}]*(?:transform|animation|transition)\s*:/is)
reject('public source contains Lucide', publicSource + packageJson + packageLock, /lucide/i)
reject('public source contains an em dash', publicSource, /—/)
reject('public source contains interface emoji', publicSource, /[\u2728\u{1F389}\u2705\u274C\u26A0\u2B50\u2605]/u)
reject('public source contains sparkle or animated arrow components', publicSource, /\b(?:Sparkles|ArrowLeft|ArrowRight)\b/)
reject('public source contains testimonial content', publicSource, /\btestimonials?\b/i)
reject('public copy contains a false-contrast slogan', publicSource, /(?:it(?:'|’)s|this is) not .{1,80}(?:it(?:'|’)s|this is)/i)

requirePattern('weather skeleton is missing', read('src/components/WeatherPanel.tsx'), /skeleton skeleton-line/)
requirePattern('map skeleton is missing', read('src/pages/MapPage.tsx'), /skeleton skeleton-map/)
requirePattern('privacy route is missing', read('src/App.tsx'), /path="\/privacy"/)
requirePattern('terms route is missing', read('src/App.tsx'), /path="\/terms"/)
requirePattern('privacy footer link is missing', read('src/components/Layout.tsx'), /to="\/privacy"/)
requirePattern('terms footer link is missing', read('src/components/Layout.tsx'), /to="\/terms"/)
requirePattern('warm paper token is missing', styles, /--paper:\s*#f3ecda/i)
requirePattern('earth accent token is missing', styles, /--clay:\s*#9d402e/i)

const result = { passed: failures.length === 0, checks: 23, failures }
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
if (failures.length > 0) process.exitCode = 1
