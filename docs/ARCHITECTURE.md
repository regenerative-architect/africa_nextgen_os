# Eight-layer architecture

| Layer | Implementation | Boundary |
|---|---|---|
| Source mesh | `spine.mjs`: 55 country entries, 15 official directories, 10 standards, four pilots | No equal-coverage assumption or invented live feed endpoint |
| Ingestion | `ingest.mjs`: RSS/Atom/JSON and HXL; source inbox and editable candidates | XML DTD/entities prohibited; dates and HTTPS source URLs required; extracted text is inference until reviewed |
| Evidence graph | `core.mjs`: alert, claim and source nodes; supports/asserts/supersedes edges; contradictions and publisher groups | Repeated publisher reports do not imply independent corroboration; revisions retain before/after snapshots in private audit events |
| Situation engine | `analyzeChange`, `analyzeWindow`, `reviewPriority`; qualitative cascade graph | No missing input invented; no population eligibility or allocation score |
| Human verification | revision-bound approvals with distinct author/reviewer/publisher | Authenticated backend checks every write; an agent credential can create drafts only |
| Relay engine | CAP XML, RSS/Atom/JSON, HXL, print card, email file, QR link; configured RapidPro v2 flow starts | No automatic sending; publisher action required; server owns recipients and credentials |
| Outcome loop | eight outcome stages, dated evidence URL, reviewer confirmation | Funding/dispatch/delivery/access/use are distinct; attribution remains uncertain |
| Governance | server membership, private correction review, append-only events, public projection | No raw internal records for viewers; source text cannot authorize tools or override policy |

## Data stores and consistency

D1 and portable SQLite share five tables: alerts, members, events, feedback, dispatches. Structured canonical payloads retain the four information types and provenance. SQL uses prepared statements, one statement per prepare, batched conditional writes, and optimistic revision checks. Schema changes use checked-in Drizzle migrations; production never creates application tables at request time.

Command IDs identify each mutation. The server rechecks current permissions before replay and prevents cross-action reuse. Draft creation and its event commit in one database batch. Revision audit events retain before and after content. They are append-only through the application API; database administrators can alter storage, so this is not an externally anchored tamper-proof audit service. SHA-256 detects content corruption and changes; it is not a publisher signature.

IndexedDB has stores for alerts, sources, evidence, locations, interventions, organizations, translations, sync_queue, outcomes, offline_packs and feedback. Public snapshots replace the previous server cache transactionally. Packs install atomically. Restricted server workspaces are not copied into packs. Queued writes are drafts or feedback; approvals, publication, outcome verification and message dispatch require a live server.

## Deterministic analysis

Changes require the same explicit indicator and unit, a baseline value/date, and a later observation date. Output includes absolute difference, relative percentage (null for a zero baseline), elapsed days, per-day difference and direction. Higher-is-worse is explicit. The application cannot prove measurement comparability or correct sampling; reviewers must inspect methodology.

An intervention window requires an evidence-backed deadline, explanation and planning lead time. Analysis time is explicit. The rule compares days remaining with lead time; it is planning arithmetic, not a clinical or probabilistic forecast. Missing deadlines return unknown.

The optional attention score uses the conversation's weights: severity .22, velocity .18, imminence .16, exposure .14, preventability .12, response gap .10, confidence .08. Each normalized input must be provided within 0–1, otherwise no score is returned. The function prioritizes analyst inspection only. It does not rank children or justify resource entitlement.

The cascade engine traverses a finite qualitative graph linking climate, WASH, infection, food access, nutrition, livelihoods, education and protection. Blocked nodes illustrate how pathways connect. Edge presence is not causal proof; no effect size, risk probability or lives-saved estimate is generated.

## Pilot scope

Sudan–Chad uses dated displacement/nutrition context. Jonglei uses a dated flood/service-disruption report without applying national totals locally. DRC/Ituri–North Kivu uses education/protection disruption evidence and qualified health-review guidance; no current Ebola outbreak is asserted. Somalia/Bay separates assessment context from an expired IPC projection. None of the 2025 references establish conditions in October 2026.
