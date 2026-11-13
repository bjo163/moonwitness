# MoonWitness Core Principles

Status: **Canonical engineering principles**.

These principles exist to keep MoonWitness understandable as it grows.

## 1. Model First

Business state and behavior begin as models. Routes, UI, workers, and integrations call into model behavior rather than defining parallel business rules.

## 2. One Canonical ORM

Moon ORM is the normal persistence path. Do not create a second repository/service persistence stack for ordinary domain data.

## 3. Server Is Transport

The server handles transport concerns: HTTP, authentication, context creation, REST/RPC, realtime, metadata, and error mapping. Domain policy belongs to addons/models.

## 4. Addons Own Domains

A domain should have one clear owner. CAB logic belongs to `moon-cab`; Mizan logic belongs to `moon-mizan`; Witness logic belongs to `moon-witness`.

Cross-addon dependencies must be explicit and minimal.

## 5. Transaction by Default

A business mutation that changes multiple records/relations must be atomic. Partial writes are bugs unless explicitly designed as asynchronous work.

## 6. Security Fails Closed

Unknown user, missing permission configuration, invalid rule data, or security evaluation failure must not silently grant access.

Only explicit public-read rules, bootstrap exceptions, or superuser behavior may bypass normal checks.

## 7. Rules Are Data, Not Code

Persisted permissions, record rules, filters, and domains must use a controlled representation. Never evaluate persisted rule content as arbitrary JavaScript.

## 8. Audit Important Mutations

Security-sensitive and business-significant writes should be traceable. Audit/Witness integration should become a reusable ORM/platform behavior, not duplicated manually in every route.

## 9. Simple Before Abstract

Do not create a framework for a single use case.

Before introducing a new abstraction, ask:

1. Do at least two real call sites need it?
2. Does it remove duplication rather than rename it?
3. Can an existing Model/ORM/Addon mechanism solve the problem?
4. Will a new contributor understand why it exists?

If the answer is unclear, keep the implementation local and simple.

## 10. One Concept, One Implementation

When two mechanisms solve the same problem, choose one canonical implementation and migrate toward it. Do not preserve permanent duplicate paths for convenience.

## 11. Explicit Over Magical

Convenient ORM behavior is welcome, but transaction boundaries, security behavior, addon dependencies, and destructive schema changes must remain observable and testable.

## 12. Production Is Stricter Than Development

Development may offer ergonomic helpers such as schema synchronization. Production must prefer deterministic migrations, safe startup, explicit secrets/configuration, and fail-fast validation.

## 13. Tests Protect Architecture

Tests are not only for outputs. Core tests should verify invariants such as:

- rollback on mutation failure
- access denied when grants are absent
- record rules constrain reads and writes correctly
- relation mutations stay inside a transaction
- addon dependency boot order is deterministic
- server handlers do not bypass ORM policy

## 14. Delete Dead Paths

Once a replacement is verified, remove obsolete compatibility paths, stale mocks, duplicate helpers, and outdated documentation. Simplicity requires deletion, not only addition.

## Review checklist

Before merging significant work, ask:

- What is the owning model/addon?
- Does it use the canonical ORM path?
- Is the mutation atomic?
- Is access explicit and fail-closed?
- Is business logic outside generic server transport?
- Did we create a duplicate mechanism?
- Is a new abstraction truly necessary?
- Are tests covering the relevant invariant?

If a change cannot answer these clearly, it is not ready for `dev`.