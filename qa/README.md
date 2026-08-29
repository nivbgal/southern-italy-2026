# Release verification

The public Pages deployment is gated by the cumulative commitment ledger and verification report for the exact finished artifact.

## Local checks

```bash
npx vitest run --config vitest.config.ts
npm run build -- --base=/southern-italy-2026/
node scripts/site-audit.mjs --root dist --base /southern-italy-2026/
npx playwright install
npx playwright test --config playwright.config.ts
node scripts/ledger-audit.mjs qa/commitment-ledger.json
node scripts/verification-gate.mjs qa/verification-report.json
```

During development only, the ledger shape can be inspected without pretending work is complete:

```bash
node scripts/ledger-audit.mjs qa/commitment-ledger.json --allow-pending
```

## Finalization rules

- Replace each `planned` ledger state with `implemented`, `verified_existing`, `excluded_approved`, or `blocked_disclosed`.
- Give implemented and existing rows concrete evidence in the exact built and deployed target.
- Add the production URL to `verification-report.json`; the workflow embeds the non-recursive exact `github.sha` in the deployed footer.
- Record evidence and a score for every category. Each category and the weighted score must be at least `0.95`.
- Remove or deactivate all hard blockers only after the cited evidence exists.
- Rerun the same smoke checks against the deployed Pages URL in an unauthenticated browser.
