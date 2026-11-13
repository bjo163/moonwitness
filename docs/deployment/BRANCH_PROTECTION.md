# GitHub Branch Protection

## Branch Architecture

\	ext
feature/*  → PR →  dev  → PR →  main  → tag →  release
\\n
| Branch | Purpose | CI |
|--------|---------|-----|
| eature/* | Feature development and fixes | Foundation CI |
| dev | Integration | Foundation CI + PostgreSQL certification |
| main | Production candidate | Foundation CI + PostgreSQL certification + release-on-tag |

## Required Rules for dev and main\n
Configure repository rulesets or branch protection so both branches:

- Require a pull request before merging
- Require at least one approving review
- Dismiss stale approvals when new commits are pushed
- Require the branch to be up to date before merging where practical
- Require Foundation CI checks:
  - Constitutional & UI Audit\n  - Lint\n  - Typecheck\n  - Test\n  - Build\n- Block force pushes
- Block branch deletion
- Do not allow ordinary contributors to bypass the rules

## Promotion Policy

- Feature work enters dev through a pull request and green Foundation CI
- dev enters main only after integration checks and applicable PostgreSQL certification pass
- Direct pushes to main are reserved for the documented emergency procedure
- Emergency hotfixes are reconciled back into dev and active feature work

## Emergency Procedure

1. Create a short-lived hotfix branch from main\n2. Open a pull request to main and record the incident reference
3. Run the applicable exact-SHA checks
4. Release only after the required gate passes
5. Open a reconciliation pull request into dev\n6. Reconcile the same change into active feature branches
7. Remove the hotfix branch after reconciliation

## CI/CD Workflows

### Foundation CI — .github/workflows/foundation-ci.yml\n
Triggers on pushes, pull requests, and manual dispatch. Every validation job is blocking.

### Production PostgreSQL Certification — .github/workflows/witness-postgres-certification.yml\n
Triggers on pull requests to dev/main, pushes to dev/main, weekly schedule, and manual dispatch.

### Release — .github/workflows/release.yml\n
Triggers on release tags.
