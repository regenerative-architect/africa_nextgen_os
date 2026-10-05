# Relay API — profile acr/1.0

Every response that contains internal data uses `Cache-Control: no-store`. JSON errors are `{ "error": "recoverable explanation" }`. Mutations require authenticated identity, membership permission, JSON content type, a matching Origin and a unique `commandId` (8–120 letters/digits/underscore/dot/hyphen). Alert mutations require the current `revision`; a conflict returns 409. Body limit is one megabyte.

| Method / route | Result / permission |
|---|---|
| GET `/api/spine` | Standards, official source directory, country registry and pilots |
| GET `/api/snapshot` | Public reviewed records, cancellation tombstones and historical references |
| GET `/api/feeds/json`, `/rss`, `/atom`, `/hxl` | Public reviewed records; no internal notes or private outcomes |
| GET `/api/packs/{region}` | Public regional snapshot plus historical references and offline resources |
| GET `/api/cap/{id}` | Public CAP Actual/Test, Update or Cancel as appropriate |
| GET `/api/identity` | Signed-in identity, effective database role and initialization status |
| GET `/api/workspace` | Role-filtered records; private feedback only for reviewer/governor |
| GET `/api/audit/{id}` | Private append-only event history; reviewer/governor |
| POST `/api/bootstrap` | First private owner governance initialization when explicitly enabled |
| POST `/api/members` | `id`, `label`, human `role`; governor |
| POST `/api/drafts` | `alert`; contributor/analyst/reviewer/governor or draft-only ingestion agent |
| POST `/api/feedback` | `alertId`, category, message; contributor-capable human |
| POST `/api/feedback-review` | Feedback `id`, status; reviewer/governor |
| POST `/api/alerts/{id}/review` | revision, approve/reject, explanatory note; distinct reviewer |
| POST `/api/alerts/{id}/publish` | revision; distinct publisher |
| POST `/api/alerts/{id}/revise` | revision, alert; author or governor; unpublished records only |
| POST `/api/alerts/{id}/cancel` | revision, reason; publisher/governor |
| POST `/api/alerts/{id}/outcome` | revision, dated outcome evidence; analyst/reviewer/governor, observed result requires reviewer |
| POST `/api/alerts/{id}/relay` | revision; configured publisher-authorized RapidPro start |

Region keys: `sudan-chad`, `jonglei`, `drc-east`, `bay`. Draft normalization discards imported workflow/review/publication fields. Claim types are observation, inference, forecast and recommendation; each observation must cite an included source object. Source date is distinct from observation date. Forecast assumptions and horizon are mandatory. Missing metrics and window inputs are allowed; the engine returns insufficient/unknown.

An optional `supersedes` points to a prior canonical message. Publication resolves that record on the backend and creates the CAP reference tuple; a browser cannot invent trusted reference metadata. An old published message remains independently inspectable. Operators cancel an obsolete publication explicitly; CAP Update references identify the replacement for consuming systems. Publication and cancellation are never triggered by feed extraction.

Public serialization is an explicit recursive allowlist. It strips coordinates, admin-2, actor IDs, review notes, private outcomes, raw report fields, contact lists and unknown nested keys. Restricted/sensitive or embargoed records return no public DTO. Do not assume text or linked reports are anonymized automatically.

Schema files, examples and tests are versioned with the source. Feed consumers must retain cancellation tombstones and honor expiry rather than treating an empty current feed as proof that no earlier alert existed.
