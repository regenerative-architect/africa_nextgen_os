# Future Earth Intelligence integration seam

This repository is a separate runtime, data store and permission domain. It imports no Earth Intelligence module, shares no credentials and creates no agent authority there. Integration can later use a versioned adapter against profile `acr/1.0` without merging review or child-data boundaries.

The export contract consists of canonical public alerts, source evidence objects, deterministic analysis outputs and cancellation/update references. Each carries ID, revision, source/observation/expiry dates and SHA-256 provenance when available. Claims retain their information type. A forecast never silently becomes an observation; a recommendation never becomes an order.

Recommended merger procedure:

1. Preserve this review service as an authority boundary; import candidate evidence through a draft-only credential.
2. Map the external ontology into this versioned profile. Retain publisher, method, dates, unit and population/geography applicability; do not equate missing values with zero.
3. Deduplicate sources using publisher identity and stable URLs/content hashes while retaining contradictory evidence. Use `supersedes` edges for corrections.
4. Export public DTOs or role-scoped evidence bundles according to a separately approved disclosure policy. Keep recipients, local complaints and case material outside shared model context.
5. Verify contract tests for imports, withdrawals, wrong roles, conflict handling and corrupted packs before enabling the bridge.
6. Do not transfer human publisher credentials into autonomous execution. Any future authenticated official-alert mirroring requires an explicitly reviewed trust configuration and separate audit trail.

No autonomous allocation, dispatch, movement, payment, diagnosis, individual ranking, accusation or physical actuation endpoint exists. The integration seam cannot upgrade authority merely by supplying a different role string or embedding instructions in source text.
