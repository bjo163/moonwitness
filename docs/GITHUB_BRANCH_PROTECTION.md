# GitHub Branch Protection

This repository uses `dev` as the integration branch and `main` as the release branch.

## Required rules for `dev` and `main`

Configure repository rulesets or branch protection so both branches:

- require a pull request before merging;
- require at least one approving review;
- dismiss stale approvals when new commits are pushed;
- require the branch to be up to date before merging where practical;
- require Foundation CI checks:
  - `Constitutional & UI Audit`
  - `Lint`
  - `Typecheck`
  - `Test`
  - `Build`
- block force pushes;
- block branch deletion;
- do not allow ordinary contributors to bypass the rules.

Foundation CI uses the repository variable `CI_RUNNER` when present and defaults to `ubuntu-latest` when it is unset. This avoids making branch promotion depend permanently on one self-hosted runner while still allowing a repository-owned runner to be selected intentionally.

## Production PostgreSQL certification

`.github/workflows/witness-postgres-certification.yml` runs on pull requests to `dev`/`main`, pushes to `dev`/`main`, weekly schedule, and manual dispatch.

For `dev → main`, require `Production PostgreSQL 18 Certification` for database, migration, API-runtime, or deployment-sensitive changes. It validates a clean PostgreSQL lifecycle and the same `apps/api/Dockerfile` artifact used by production Compose.

## Promotion policy

- feature work enters `dev` through a pull request and green Foundation CI;
- `dev` enters `main` only after integration checks and applicable PostgreSQL certification pass;
- direct pushes to `main` are reserved for the documented emergency procedure;
- emergency hotfixes are reconciled back into `dev` and active feature work.

## Emergency procedure

1. Create a short-lived hotfix branch from `main`.
2. Open a pull request to `main` and record the incident reference.
3. Run the applicable exact-SHA checks.
4. Release only after the required gate passes.
5. Open a reconciliation pull request into `dev`.
6. Reconcile the same change into active feature branches.
7. Remove the hotfix branch after reconciliation.

Branch-protection administration remains outside repository code. Repository owners configure these rules in GitHub Settings → Rules / Branch protection.
