# GitHub Branch Protection

This repository uses `dev` as the integration branch and `main` as the release branch.

## Required rules for `dev` and `main`

Configure a repository ruleset or branch protection rule matching each branch:

- require a pull request before merging;
- require at least one approving review;
- dismiss stale approvals when new commits are pushed;
- require the branch to be up to date before merging where practical;
- require the status check `Lint, Typecheck, Test, Build`;
- block force pushes;
- block branch deletion;
- do not allow bypassing these rules for ordinary contributors.

The PostgreSQL certification workflow runs on pushes to `dev` and `main`, weekly, and manually. It
is a release/database-validation check and should be required for the `dev → main` promotion rule
once a PostgreSQL-capable self-hosted runner is available. It intentionally does not run on
`pull_request` events because it uses a self-hosted runner.

## Promotion policy

- feature work enters `dev` through a pull request and Foundation CI;
- `dev` enters `main` only through a pull request after integration checks pass;
- direct pushes to `main` are reserved for the documented emergency procedure;
- an emergency hotfix must be merged back into `dev`, then reconciled into active feature work.

## Emergency procedure

1. Create a short-lived hotfix branch from `main`.
2. Open a pull request to `main` and record the incident reference.
3. After release, open a second pull request from the hotfix commit into `dev`.
4. Reconcile the same change into any active feature branch.
5. Remove the hotfix branch after both reconciliations are merged.

Branch protection administration is intentionally kept outside repository code. Only a repository
owner/administrator can create or modify these rules in GitHub Settings → Rules → Rulesets.
