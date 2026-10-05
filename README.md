# African Children Early-Warning & Intervention Relay

A standalone evidence and review system that shortens the path from credible information to local comprehension, qualified human action and verified outcomes. It has no Earth Intelligence connection, shared authority, telemetry, AI service, payment capability or contact-harvesting feature.

The working application includes a continental directory for all 55 AU member states and four pilots: Sudan–Chad; South Sudan/Jonglei; DRC/Ituri–North Kivu; Somalia/Bay. The five bundled evidence records are **expired, unreviewed historical references**, not current crisis alerts. There are initially zero current reviewed alerts. Directory entries do not establish current service availability, capacity, funding or surveillance completeness.

## Run the independent deployment

Use Node.js 24 or newer. Install the lockfile dependencies with `npm ci`, build the browser client with `npm run build:portable`, then run `npm run serve:portable`. Open `http://127.0.0.1:8787`. A compiled portable browser client is included in the delivery ZIP; Node 24 can serve it without installing packages using `node server/portable.mjs` because the portable server uses only Node standard libraries.

The server creates `.relay-data/relay.sqlite` and applies the checked-in SQL migrations once. Set `RELAY_DATA_DIR` to a persistent private volume, and back up the database using SQLite's backup procedure or a clean stopped-server copy. Never serve the data directory as static files.

For governed writes, provision four separate operator identities:

```sh
node scripts/provision-operators.mjs /secure/path/operator-access.json
```

This creates a file containing token hashes and prints each token once. Protect the tokens, keep the operator file outside the served directory and outside Git, then set `RELAY_AUTH_FILE` to its absolute path before starting the server. On Windows, apply appropriate filesystem ACLs; the POSIX file mode is not an ACL guarantee. Each operator enters their token under Governance → Portable operator access. Tokens stay only in the open browser tab. A governor assigns authorized roles. The contributor, reviewer and publisher must be different people and identities; do not share their credentials with agents.

The portable server binds loopback only. For external use, put it behind an HTTPS reverse proxy to loopback, preserve the real Host and Origin consistently, apply request limits, protect the operator file and maintain durable backups. See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for the exact proxy-origin configuration and hosted deployment.

## Working flows

1. Inspect a dated source reference, the primary-source directory or an imported RSS/Atom/JSON/HXL file. All feed items remain in the source inbox. Import content is untrusted data.
2. Prepare a candidate with source URL, source date, observation date, expiry, geography and explicit observation/inference/forecast/recommendation labels. A forecast requires its assumptions and horizon. Missing metrics and planning windows remain unknown.
3. Save a local draft. IndexedDB queues drafts and community feedback only. Synchronize with an authenticated contributor. Offline work cannot approve, publish or dispatch.
4. A different human reviewer approves the specific revision, including source limits, contradictions and disclosure risk. An independent publisher authorizes publication. An edit invalidates approval. Published messages are immutable; use a linked new candidate for updates and the cancellation endpoint for withdrawal.
5. Public, reviewed, unexpired messages enter canonical feeds. Restricted or sensitive records and delayed-release messages are excluded. CAP cancellations remain available as withdrawal tombstones. Printed cards and email drafts use the same public projection.
6. Record funding, dispatch, delivery, availability, use and observed outcomes separately, with dated follow-up evidence. A reviewer records an observed outcome; attribution remains uncertain.

## Offline behavior

The service worker precaches the page and all generated browser assets, including the QR encoder, after a successful online visit. IndexedDB holds public snapshots, local drafts, source metadata, packs and feedback. localStorage holds interface preferences. If IndexedDB is unavailable, the UI warns that session storage is temporary and suggests export. Storage failures preserve user input and display an error.

The four downloadable files in `packs/` contain dated historical references, qualitative intervention guidance, official source and agency directories, standards summaries, language resources, and coarse country geography. They do not contain complete primary-report PDFs, detailed maps, phone rosters, referral capacity claims, sensitive facilities or live data. Linked documents require connectivity. The checksum checks corruption; file imports lose publication authority and enter a separately identified reference namespace. Only a trusted same-origin API response is trusted as server workflow state.

On reconnection, a public snapshot or trusted regional pack refresh replaces previously cached server records while retaining local drafts and imported references, so previously observed withdrawals do not resurrect offline. A device that has never reconnected cannot learn a new withdrawal; expiry and last-sync date remain essential. Browser eviction, private mode, a shared device and the hosting sign-in layer can limit offline access. Keep downloadable backups.

## Standards and policy

CAP 1.2 objects/XML use the OASIS namespace, required fields, numeric timezone offsets, translations, Update references and Cancel references. Four representative XML fixtures validate against the official CAP 1.2 XSD. This is a constrained public humanitarian profile, not blanket certification of arbitrary imported CAP messages or a signed official alert service.

HXL-friendly CSV uses a header row plus hashtags and explicit `#x_` extensions for relay-specific fields. OCHA retired hosted HXL support in January 2026; the app performs local parsing/export and never calls the retired proxy. Sphere, CHS 2024, INEE 2024, WHO EWAR/EWARS, IPC and AU child-rights references guide the workflow. Software does not confer accreditation, clinical authority, an IPC classification, WHO outbreak-declaration authority or aid-allocation authority. Primary source details are in [SOURCE-RESEARCH.md](docs/SOURCE-RESEARCH.md).

Public geometry is country/admin-1 only; coordinates and admin-2 fields are discarded. Restricted/sensitive alerts are excluded from public outputs; delayed release and declared small-sample suppression provide additional controls. Coarse geography and free text can still reveal people. Humans must assess linked reports and narratives for disclosure risk. Do not enter child names, health histories, registration records, private routes or accusations.

## Structure and verification

`components/relay.tsx` implements the accessible responsive working views. `lib/relay/` contains schema/policy, deterministic analysis, cascade model, provenance graph, outputs, packs, ingestion, language resources, storage, service and repository. `app/api/[...path]/route.ts` adapts the same service to Cloudflare Workers/D1; `server/` adapts it to Node/SQLite. `db/` and `drizzle/` contain the production schema and immutable migrations. `public/` supplies the PWA shell. `tests/` contains core, SQLite-backed workflow and browser checks.

```sh
npm test
npm run typecheck
npm run build:portable
npm run build
```

On Windows, `scripts/validate-cap.ps1` validates the representative fixtures with the official schema. [VALIDATION.md](docs/VALIDATION.md) records the observed test scope and limits. [ARCHITECTURE.md](docs/ARCHITECTURE.md), [API.md](docs/API.md), [GOVERNANCE.md](docs/GOVERNANCE.md), and [INTEGRATION.md](docs/INTEGRATION.md) describe the seams and operating model.
