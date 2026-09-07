# Runtime data classification

Production UI and API responses must distinguish source-backed data from derived
values, unavailable values, demo seed data, and test fixtures.

- Source-backed: returned from a canonical API, corpus, or persisted domain model.
- Derived: deterministically calculated from source-backed inputs; label it as derived
  when it is exposed to users.
- Unavailable: no source value exists; omit the field or return `null`.
- Demo/test: allowed only in explicitly named seed, fixture, or test paths and must
  never silently appear as production content.

The daily history endpoint follows this policy: its period sequence and selected IDs
are derived, while ayah content is returned only when present in the Witness API.
