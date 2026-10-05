# Validation record — 5 October 2026

This release was validated as a functioning standalone pilot with synthetic workflow records and dated historical source references. The checks do not establish field effectiveness, real service capacity, institutional certification or current crisis surveillance.

| Check | Observed result | Scope |
|---|---|---|
| Core and SQLite-backed API checks | 44 passed, 0 failed | Schema, four claim types, deterministic analysis, provenance, role separation, source/claim integrity, privacy allowlists, stale revisions, immutable publication, CAP Update/Cancel, agent limits, feedback, outcomes, import/export checksums, cached withdrawal reconciliation and mocked RapidPro dispatch |
| Browser checks | 15 passed, 0 failed; no page errors | Isolated headless Chrome; routes, search/filter, draft editor, feedback synchronization, downloads, corrupt import recovery, source parsing, persistence, Arabic RTL, keyboard skip/modal focus, accessible control labels, desktop/mobile overflow and full offline cold reload |
| CAP 1.2 official XSD | 4 of 4 representative fixtures passed | Reference/Test, synthetic Actual publication, linked Update and Cancel; official OASIS schema included with attribution |
| TypeScript | Passed | `tsc --noEmit` |
| Portable production build | Passed | Vite client served by Node/SQLite |
| Hosted production build | Passed | Vinext Cloudflare Worker/D1 output |

Machine-readable evidence is in `browser-validation.json` and `cap-validation.json`. The core/API transcript is in `test-validation.txt`. The browser suite is reproducible in `tests/browser.mjs` with pinned Playwright 1.62.1. A Chrome executable was already available; no browser runtime is claimed to be bundled in the delivery.

## Reproduce core and CAP checks

Install lockfile dependencies with Node 24+, then run `npm test`, `npm run typecheck`, `npm run build:portable` and `npm run build`. On Windows run `./scripts/validate-cap.ps1`. Tests use in-memory SQLite with checked-in migrations and no production credentials. Test fixtures clearly identify synthetic assertions; CAP fixture `Actual` is a schema-conformance test value, not an actual humanitarian warning.

## Reproduce browser checks

Start a separate local portable server with a fresh temporary `RELAY_DATA_DIR` and `RELAY_DEV_USER=browser-test-contributor`. Keep this development identity out of all external deployments. Run `npm run test:browser` in a second terminal. `TEST_ORIGIN` defaults to `http://127.0.0.1:8787`; `CHROME_PATH` can select an installed Chrome executable. Windows defaults to the installed Chrome channel. On other platforms install the browser runtime supported by the pinned Playwright dependency. `BROWSER_ARTIFACT_DIR` defaults to `work/browser` and contains screenshots and downloaded fixtures.

The suite assumes a fresh database and browser context. It installs the service worker online, saves a regional pack, sets the browser fully offline, reloads the application, opens saved evidence and generates the QR image from cached code. It verifies storage after asynchronous initialization completes. It also exercises malformed JSON/checksum errors and imported XML/JSON/HXL candidate handling.

## What the evidence establishes

Draft author, reviewer and publisher identities are distinct and verified on each request. Changes invalidate approvals; published records require a linked new candidate rather than in-place edits. Agent capabilities end at draft creation/revision, and command replay cannot reveal later human review notes or outcomes. Browser-submitted identities/roles and imported workflow metadata cannot grant authority.

Public serializers reject malformed nested geography and authority metadata, strip unknown private fields, degrade geography to country/admin-1, exclude restricted/sensitive/embargoed records and suppress metrics with a declared sample size below ten. Public cache reconciliation and trusted regional pack refreshes remove withdrawn server records while preserving local drafts and untrusted imports. RSS, Atom, JSON, HXL and email outputs identify cancellation explicitly; CAP provides standard references. Internal server review/outcome records are not persisted as public snapshots, and clearing a portable session clears its private in-memory workspace even when offline.

RapidPro tests use a local mock of the current API payload. They check configuration, role/expiry gates, deduplication and cancellation race handling. No actual recipient message was sent. Accepted flow-start requests are distinguished from recipient delivery and intervention outcomes.

## Limits and remaining operational work

- No independent security audit, formal WCAG conformance audit, safeguarding certification or humanitarian field trial has been completed. Accessibility evidence covers the listed controls and layouts, not every assistive technology.
- No real multi-person authentication/browser exercise, live RapidPro delivery, production load test, production backup restore or cross-browser field test was performed. API tests simulate distinct authenticated identities against the real repository/service logic.
- The hosted publication is verified by deployment status. Browser behavior was tested against the local portable adapter; private hosting authentication, browser storage eviction and connectivity conditions can affect field offline access.
- No automated live feed is activated. Fifteen official source directories and ten standards entries have dated provenance. Five historical references remain expired and unreviewed, with zero current reviewed alerts initially. A directory link is not a feed endpoint or a service-capacity claim.
- Interface translations in five languages are provisional. Qualified local review is still required for operational translations, source interpretation, disclosure risk and interventions.
- Checksum verification detects corruption; it does not authenticate the publisher. Imported files become references/new drafts, never approved publications.
- A permanently offline device cannot learn a later withdrawal. Show expiry/last synchronization, refresh packs and retain the operational correction channel.
- Event history is append-only through the application API, not cryptographically tamper-proof against a database administrator. Identity separation cannot prove that different accounts correspond to different people.
- Queries and imports are bounded for the pilot. Add pagination, retention, rate limits, scale testing and organizational processes before broader operation.
