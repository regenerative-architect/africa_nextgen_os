# Deployment and recovery

## Hosted Worker/D1 edition

The Sites deployment uses the checked-in `.openai/hosting.json` identity, logical `DB` binding, generated Worker output and Drizzle migrations. It is initially owner-private. Authentication comes from the trusted Sites dispatcher; the Worker checks authenticated identity and database membership before each governed action. Browser-submitted role strings and agent-supplied identity headers are not authority.

The initial runtime contains `RELAY_OWNER_BOOTSTRAP=private-owner`, allowing the sole private owner to initialize governance from the Governance view. Bootstrap inserts one governor only when membership is empty. Before widening the Site audience, remove that variable, provision the required known human identity IDs, and retain separate author/reviewer/publisher accounts. Only an owner changes hosting access. Do not share the site publicly as a shortcut around the review workflow.

The production database migrates before Worker upload. Retain applied migration SQL and metadata unchanged. Add later migrations rather than rewriting an applied migration. A failed deployment may already have applied a migration; inspect the platform's reported applied boundary before repair.

The hosted build uses `npm run build`; source is pushed and the saved version is deployed with the native Sites workflow. In this managed Windows session, the generic package-manager launcher failed, so builds were invoked directly through the same project framework script, and the deployment workflow reused those verified outputs. Dependency installation required network access, and child-process build/database tools required the expanded execution context. Those are tooling limits, not skipped application checks.

## Portable Node/SQLite edition

The delivery ZIP includes `portable-dist/`. Run `node server/portable.mjs` with Node 24+ for a loopback-only deployment. To rebuild, install the pinned lockfile dependencies and run `npm run build:portable`. The server and all API rules use Node standard libraries; no cloud account is required. The SQLite database persists under `.relay-data/` by default.

Required production setup:

- Persistent private `RELAY_DATA_DIR`, backup schedule and a tested restore.
- `RELAY_AUTH_FILE` containing operator IDs, labels, roles and SHA-256 token hashes; keep it outside served content.
- Four distinct people for governance, authorship, review and publication; operationally validate reviewer qualifications and local representation.
- An HTTPS reverse proxy to `127.0.0.1:8787` with request/body limits and abuse protection. Set `RELAY_PUBLIC_ORIGIN` to the exact external HTTPS origin. The portable server uses that origin for same-origin mutation checks and canonical links; configure proxy Host/Origin consistently. Never trust arbitrary user-supplied proxy identity headers.
- No `RELAY_DEV_USER` outside local development. That explicit shortcut exists only in the Node test server and is never compiled into the hosted Worker.

Set `PORT` to change the loopback port. `RELAY_PUBLIC_ORIGIN` must be an origin (for example `https://relay.example.org`), without a path, query, fragment or credentials. If absent, the application expects `http://127.0.0.1:8787`. Restrict the reverse-proxy forwarding path to the configured host and maintain HTTPS; the platform cannot determine whether local credentials correspond to different real humans.

## Optional RapidPro adapter

Set the following server-only values, and use secrets for tokens:

| Variable | Purpose |
|---|---|
| `RAPIDPRO_ORIGIN` | HTTPS RapidPro origin |
| `RAPIDPRO_TOKEN` | Approved API token |
| `RAPIDPRO_FLOW` | Existing approved flow UUID |
| `RAPIDPRO_GROUPS` | Comma-separated existing consented group UUIDs, at most 100 |

The publisher explicitly authorizes the relay for a public reviewed unexpired alert. The server sends `POST /api/v2/flow_starts.json` with `params`, `restart_participants:false` and `exclude_active:true`. Recipients are not taken from a browser, alert object, imported pack or agent. The adapter reserves a deduplicated dispatch key against the current database revision and workflow, preventing stale reads from starting a flow after a conflicting change.

A network timeout yields **uncertain**, not delivered. HTTP 429 preserves Retry-After. There is no automatic retry or duplicate dispatch. Reconcile in RapidPro before retrying failed/uncertain work; the current adapter intentionally retains its reservation to prevent blind duplicate sending. A deliberate new dispatch requires administrator reconciliation and a newly reviewed message revision, not clearing a row casually. Accepted flow starts are asynchronous and prove neither recipient receipt nor an intervention outcome. Live sending is disabled until genuine configuration and authorized groups exist.

## Source refresh and scheduled operation

The registry contains official source directories, not purported working feed endpoints. Import real RSS/Atom/JSON/HXL files or use the optional JSON ingestion command with explicitly configured primary endpoints. New content becomes draft inference. No unattended updater, agent runtime or invented endpoint is activated by this delivery. An operator may schedule the draft-only ingestion CLI after validating endpoints and supplying a narrowly scoped ingestion credential. Human review/publication still remain separate.

## Operational limits

Queries are bounded to 500 alerts/members/feedback, 1,000 audit events per record, 40 claims/sources per alert and one-megabyte imports. The first release is a pilot workspace, not a national surveillance database. Add pagination, retention policy and scale/load testing before growing beyond these limits. Cloudflare Worker memory is shared and finite; keep packs small and do not upload raw case histories.

No external penetration test, independent safeguarding review, institutional certification, live RapidPro delivery test, production restore exercise or field deployment has been completed. Offline validation covers a local isolated Chrome context; private hosted access can depend on cached sign-in state, browser policy and storage eviction. Source-registry checks are dated 5 October 2026 and are not a continuous availability monitor.
