# Primary-source implementation notes

Checked 5 October 2026. Bounded research used the Exa Search skill, covering 104 requested search-result slots and reading selected original publisher pages. These notes are implementation evidence, not a current humanitarian needs assessment. No current incident totals, funding totals, named child stories or inferred actor capacity are supplied as seeds.

## Interoperability and standards

| Reference | Implementation implication |
|---|---|
| [OASIS CAP 1.2, 1 July 2010](https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html) | Enforce required envelope and information fields, namespace, numeric timezone offsets, conditional restriction/address fields, and reference tuples. CAP UTC uses `-00:00`; export code must not emit `Z`. Keep historical/demo messages `Test` or `Draft`. |
| [Archived HXL library documentation](https://hxlstandard.github.io/libhxl-python/) and [official attribute guidance](https://centre.humdata.org/ufaq-category/cxl-hashtags-attributes/) | Export a readable header and HXL hashtag metadata row. Use core geography/sector/date/organization tags and `#x_` extensions for relay-specific fields. |
| [OCHA HXL retirement notice, 21 January 2026](https://centre.humdata.org/retiring-hxl-services/) | HXL support and related HDX services ended 31 January 2026. Internal HXL workflows remain possible. Do not depend on the retired proxy or imply tags are still required by HDX. |
| [Sphere Handbook 2018](https://www.spherestandards.org/handbook/) | Reference context-aware WASH, food security/nutrition and health guidance. A threshold flag does not prove service quality or diagnose a child. |
| [CHS 2024](https://www.corehumanitarianstandard.org/the-standard) | Community participation, safe complaints, accountability and learning need visible product workflows. Software alignment does not constitute CHS organizational verification. |
| [INEE Minimum Standards 2024](https://inee.org/resources/inee-minimum-standards) | Use for education and safe learning access; Sphere's technical chapters do not include education. |
| [WHO EWAR operational guide, 27 January 2023](https://www.who.int/publications/i/item/9789240063587) | Separate signal, event, verification, risk assessment and alert stages. Health candidates require qualified human review. The app is not WHO EWARS or a national surveillance system. |
| [IPC Manual 3.1](https://www.ipcinfo.org/ipcinfo-website/resources/ipc-manual/en/) and [IPC FAQ](https://www.ipcinfo.org/ipcinfo-website/faqs/en/) | Preserve published classifications and their periods; never derive an IPC phase from the app's score. Risk of Famine and Famine classifications differ. IPC analysis is not intervention-impact evaluation. |
| [OCHA Data Responsibility Guidelines, January 2025](https://www.unocha.org/publications/report/world/data-responsibility-guidelines-january-2025) | Apply disclosure-risk review to personal and non-personal data. Geographic degradation is a conservative app policy; aggregation does not guarantee anonymity. |
| [AU African Child Charter](https://au.int/en/treaties/african-charter-rights-and-welfare-child) | Child best interests, privacy, health, education and protection frame governance; the system receives no legal authority from the charter. |

For CAP claims, use “CAP-compatible objects and XML profile” until an official schema-validation check has passed. Schematron-like application restrictions may be stronger than CAP itself. The human-review requirement is this application's policy; CAP does not impose the policy or grant authority to issue warnings.

## RapidPro adapter contract

[RapidPro API v2](https://rapidpro.io/api/v2/) requires HTTPS and `Authorization: Token …`. Keep credentials on the server. [Flow starts](https://rapidpro.io/api/v2/flow_starts) use `POST /api/v2/flow_starts.json`, a required flow UUID, optional contacts/groups/URN arrays of up to 100 strings each, and `params` of at most 10K characters. Set `restart_participants: false` and `exclude_active: true` by default. Modern docs use `params`; older clients may expose `extra`.

[Broadcasts](https://rapidpro.io/api/v2/broadcasts) use a translations object and ISO-639-3 language keys such as `eng`, `fra` and `ara`. Honor `Retry-After` for HTTP 429. Request acceptance starts asynchronous work and does not establish recipient delivery, local intervention or welfare improvement. Verify with a local mock without sending to real contacts; keep human dispatch approval in front of any configured remote adapter.

## Pilot references

| Pilot | Primary dated source | Safe reference statement |
|---|---|---|
| Sudan–Chad | [UNICEF Wadi Fira nutrition response, 7 June 2025](https://www.unicef.org/chad/stories/sudanese-crisis-responding-nutrition-emergency-save-childrens-lives-wadi-fira-chad) | Publisher described refugee arrivals into eastern Chad and nutrition treatment needs following attacks near El Fasher. Retain the source date; omit names, individual health details and current totals. |
| South Sudan/Jonglei | [UNICEF Report No. 8, August 2025 reporting period](https://www.unicef.org/media/174721/file/South-Sudan-Humanitarian-SitRep-31-August-2025.pdf.pdf) | Publisher described flooding, displacement and disrupted operations involving Jonglei among other states. Published 3 October 2025. National totals are not Jonglei measurements. |
| DRC/Ituri–North Kivu | [UNICEF Ituri education release, 29 May 2025](https://www.unicef.org/press-releases/over-130000-additional-children-out-school-dr-congos-ituri-province-violence) | Publisher described violence and displacement interrupting education in Ituri and broader eastern DRC, including North Kivu. Treat as historical source context, without current severity or coordinates. |
| Somalia/Bay observation | [FSNAU/IPC Somalia snapshot, published 23 September 2025](https://fsnau.org/downloads/Somalia_IPC_Acute_Food_Insecurity_Malnutrition_Jul2025_Dec2025_Snapshot.pdf) | Source reported WASH and disease factors contributing to malnutrition among assessed populations including Bay/Baidoa. Separate urban, rural and displaced populations. |
| Somalia/Bay forecast | [Same FSNAU/IPC source](https://fsnau.org/downloads/Somalia_IPC_Acute_Food_Insecurity_Malnutrition_Jul2025_Dec2025_Snapshot.pdf) | Keep its October–December 2025 projection in the forecast layer, mark it expired, preserve stated assumptions and do not infer that it happened. |

The seed records in `research.json` are unreviewed historical references. Their retrieval date is not their observation date. The product should make this distinction prominent, and they should not become actual public alerts or current trend inputs without refreshed evidence.

## Continental evidence spine

Start with [UNICEF appeals and country reports](https://www.unicef.org/appeals), [Africa CDC surveillance resources](https://africacdc.org/thematic-area/surveillance-and-disease-intelligence/), [WHO AFRO](https://www.afro.who.int/), [WFP operation documents](https://www.wfp.org/operations), [IPC](https://www.ipcinfo.org/), [UNHCR Operational Data Portal](https://data.unhcr.org/) and [AU/ACERWC](https://www.acerwc.africa/). Primary publisher documents carry greater evidentiary weight than summaries, but no publisher is treated as infallible. Retain contradictions and the source's own uncertainty.

These are source directories, not verified RSS/Atom/JSON endpoints. Keep feed URLs null until a real endpoint is observed and parsed. No automatic scraping or live-refresh claim follows from the presence of a directory link. Published plans and official organization names also do not prove local delivery capacity, access, funding, contacts or consent. The UNICEF Somalia situation-report directory timed out twice through the research fetch tool; direct UNICEF report PDFs remained discoverable. Treat this as an unverified directory fetch, not proof of site unavailability.

## Review and inference rules

- Generated change/window/nexus outputs remain deterministic application inferences with rule IDs, input claim IDs, limits and reproducible explanations. They are neither validated predictions nor IPC or WHO classifications.
- Keep observations, source forecasts, inferences and recommendations separate, including in exports. Preserve publication, observation, validity, retrieval and review dates.
- Keep private correction text, recipient identities and sensitive locations out of public feeds, CAP, print, QR payloads and offline packs. Redaction must happen before serialization.
- High-stakes health, famine, protection and service-safety statements require a human reviewer with relevant expertise. Review should record evidence examined and reasons, not only a status toggle.
- Outcome verification needs follow-up evidence and a method. A message receipt or completed workflow alone cannot verify a child's welfare outcome.
- No autonomous-agent function may issue Actual warnings, dispatch messages, assign cases, direct movement, allocate money or alter governance permissions. Integration events carry data and provenance only; authority stays with explicitly authenticated human roles.

## Research limits

No license to redistribute whole reports was inferred. Link to originals and include short paraphrases rather than bundled publisher PDFs. Source-specific legal terms and translations still need review if a deployment will redistribute fuller texts. The source directory is a starter catalog, not an exhaustive list of African sources or qualified responders. Primary local ministries, community organizations and national meteorological agencies can be added after a documented provenance and disclosure-risk assessment.
