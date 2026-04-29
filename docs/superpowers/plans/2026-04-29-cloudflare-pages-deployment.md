Active task path: `planning/active/cloudflare-pages-deploy/`
Lifecycle state: `waiting_execution`
Sync-back status: `synced on 2026-04-29`

# Cloudflare Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move ChartMage's public hosting to Cloudflare Pages so pushes to `origin/main` automatically update production, while PRs and non-production branches receive preview deployments and the site is reachable via `*.pages.dev` and an optional custom domain.

**Architecture:** Cloudflare Pages will connect directly to `ilderaj/chart-mage` through Git integration. The first production cut will publish the existing static app surface instead of binding deployment to the legacy Gulp pipeline, so the repo can reach a stable public URL before any optional build-chain modernization.

**Tech Stack:** Cloudflare Pages, GitHub integration, static HTML/CSS/JS, repository docs, optional Cloudflare DNS / custom domain management.

---

### Task 1: Freeze the repository-side hosting contract

**Files:**
- Create: `app/_headers`
- Modify: `README.md`
- Modify: `package.json`
- Test: local static-serve check from `app/`

- [ ] **Step 1: Add Cloudflare Pages response headers**

Create `app/_headers` with a conservative static-hosting policy:

```txt
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/images/*
  Cache-Control: public, max-age=31536000, immutable

/css/*
  Cache-Control: public, max-age=86400

/js/*
  Cache-Control: public, max-age=86400
```

- [ ] **Step 2: Add repo scripts that reflect the hosting contract**

Update `package.json` scripts so the repo has explicit local hosting and build-check commands:

```json
{
  "scripts": {
    "serve:app": "python3 -m http.server 8000 --directory app",
    "build": "gulp",
    "build:check": "gulp"
  }
}
```

Keep existing fields unchanged unless they conflict. The intent is not to redesign tooling, only to make the deployable surface explicit.

- [ ] **Step 3: Document the new deployment contract in README**

Add a dedicated deployment section to `README.md` explaining:

```md
## Deployment

ChartMage is deployed on Cloudflare Pages through GitHub integration.

- Production branch: `main`
- Production URL: `https://<project>.pages.dev`
- Preview deployments: every non-production branch and supported pull request
- First-stage publish surface: `app/`

### Local preview

```bash
npm run serve:app
```

Open `http://127.0.0.1:8000/index.html`.

### Legacy build pipeline

The repository still includes the historical Gulp pipeline for local build verification:

```bash
npm run build:check
```

Cloudflare Pages is not required to use that pipeline for the first production rollout.
```

- [ ] **Step 4: Verify the static app surface locally**

Run:

```bash
npm run serve:app
```

Expected:
- `http://127.0.0.1:8000/intro.html` loads without missing assets
- `http://127.0.0.1:8000/index.html?maestro=1` loads the app shell

- [ ] **Step 5: Verify the legacy build still works as a fallback**

Run:

```bash
npm run build:check
```

Expected:
- `gulp` exits with code `0`
- `dist/` is regenerated successfully

- [ ] **Step 6: Commit the repository-side hosting contract**

```bash
git add app/_headers README.md package.json
git commit -m "chore: prepare chartmage for cloudflare pages deployment"
```

### Task 2: Provision the Cloudflare Pages project

**Files:**
- Modify: none in repo
- Configure: Cloudflare dashboard project settings
- Test: initial Pages deployment logs and live URL

- [ ] **Step 1: Create the Pages project from GitHub**

In the Cloudflare dashboard:

```text
Workers & Pages -> Create application -> Pages -> Connect to Git
```

Connect the GitHub account that can access:

```text
ilderaj/chart-mage
```

- [ ] **Step 2: Configure the build as a static publish from app/**

Use these settings during project setup:

```text
Project name: chart-mage
Production branch: main
Framework preset: None
Build command: (leave blank)
Build output directory: app
Root directory: /
```

If the dashboard requires a build command, explicitly keep it empty rather than pointing at the legacy Gulp chain for the first rollout.

- [ ] **Step 3: Save and deploy the first production build**

Expected output:
- Cloudflare provisions `https://chart-mage.pages.dev` or a similar project subdomain
- The deployment completes without needing Node package installation for production hosting

- [ ] **Step 4: Record the exact production hostname**

Add the real Pages hostname back into `README.md` once assigned:

```md
- Production URL: `https://chart-mage.pages.dev`
```

If the assigned name differs, document the actual value.

- [ ] **Step 5: Commit the documentation update with the real hostname**

```bash
git add README.md
git commit -m "docs: record cloudflare pages production url"
```

### Task 3: Enable production and preview deployment behavior

**Files:**
- Modify: `README.md`
- Configure: Pages preview settings
- Test: branch preview and production deployment behavior

- [ ] **Step 1: Confirm `main` is the production branch**

In the Pages project settings, verify:

```text
Production branch = main
```

- [ ] **Step 2: Confirm preview deployments remain enabled**

Keep the default Pages preview behavior so that:

```text
push to dev -> dev.<project>.pages.dev alias updates
PR from same repository -> unique preview URL updates on each push
```

- [ ] **Step 3: Decide preview visibility policy**

Choose one and record it in `README.md`:

```md
### Preview deployments

- Branch previews are enabled for non-production branches.
- Pull request previews are public by default.
```

If preview privacy is required, replace the second line with:

```md
- Pull request previews are protected with Cloudflare Access.
```

- [ ] **Step 4: Verify branch alias behavior from `dev`**

Push a trivial non-user-facing commit to `dev` and confirm that Pages creates:

```text
<hash>.<project>.pages.dev
dev.<project>.pages.dev
```

Expected:
- preview URL returns `200`
- preview does not overwrite production

- [ ] **Step 5: Verify production updates on `main` push**

Merge the `dev` test commit or push a direct documentation-only change to `main` and confirm:

```text
https://<project>.pages.dev
```

updates to the latest commit.

- [ ] **Step 6: Commit the preview deployment documentation**

```bash
git add README.md
git commit -m "docs: describe cloudflare pages preview workflow"
```

### Task 4: Attach a custom domain without disturbing the first rollout

**Files:**
- Modify: `README.md`
- Configure: Cloudflare Pages custom domain settings
- Test: custom domain resolution and TLS

- [ ] **Step 1: Keep `pages.dev` as the initial verified production endpoint**

Before touching DNS, confirm both:

```bash
curl -I https://<project>.pages.dev
curl -I https://<branch>.<project>.pages.dev
```

Expected:
- production returns `200`
- preview returns `200` and includes `x-robots-tag: noindex`

- [ ] **Step 2: Attach a custom subdomain or apex domain in the dashboard**

For a subdomain, use:

```text
Pages project -> Custom domains -> Set up a domain -> app.example.com
```

For an apex domain, first ensure the zone is managed on the same Cloudflare account.

- [ ] **Step 3: Apply the correct DNS pattern**

For a subdomain at an external DNS provider:

```text
CNAME app.example.com -> <project>.pages.dev
```

For an apex domain on Cloudflare DNS:

```text
Add the apex domain through Pages and allow Cloudflare to create the required record
```

- [ ] **Step 4: Document the chosen domain mode in README**

Add one of these blocks:

```md
### Custom domain

Production is also available at `https://app.example.com`.
```

or

```md
### Custom domain

Production is also available at `https://example.com`.
```

- [ ] **Step 5: Verify domain health and certificate issuance**

Run:

```bash
curl -I https://app.example.com
```

Expected:
- returns `200`
- certificate is issued successfully
- content matches the current production deployment

- [ ] **Step 6: Commit the domain documentation**

```bash
git add README.md
git commit -m "docs: record cloudflare pages custom domain"
```

### Task 5: Final verification, rollback notes, and operating rules

**Files:**
- Modify: `README.md`
- Create: `docs/deployment/cloudflare-pages.md`
- Test: production / preview / rollback procedure

- [ ] **Step 1: Add an operator runbook**

Create `docs/deployment/cloudflare-pages.md` with:

```md
# Cloudflare Pages Operations

## Production
- Git provider: GitHub
- Repository: `ilderaj/chart-mage`
- Production branch: `main`
- Publish surface: `app/`

## Preview
- Non-production branches create preview deployments automatically.
- Pull requests from this repository update their preview URL automatically.

## Rollback
1. Open Cloudflare Pages.
2. Select the project.
3. Open Deployments.
4. Choose a known-good deployment.
5. Trigger rollback.

## Build / release guardrails
- Do not use `github_page` as a deployment branch.
- Treat `main` as the only production release source.
- Verify `pages.dev` before changing custom-domain DNS.
```

- [ ] **Step 2: Link the runbook from README**

Add:

```md
See `docs/deployment/cloudflare-pages.md` for the operating runbook.
```

- [ ] **Step 3: Verify the full deployment flow after a docs-only commit**

Run this end-to-end check:

```bash
git checkout dev
git commit --allow-empty -m "chore: verify cloudflare preview"
git push origin dev

git checkout main
git merge --ff-only dev
git push origin main
```

Expected:
- `dev` preview updates first
- production updates only after `main` receives the commit

- [ ] **Step 4: Capture the rollback proof points**

Record these exact values in `docs/deployment/cloudflare-pages.md`:

```md
- Cloudflare project name: `<actual-project-name>`
- Production URL: `https://<actual-project>.pages.dev`
- Custom domain: `https://<actual-domain>`
- Last verified on: `YYYY-MM-DD`
```

- [ ] **Step 5: Commit the operations documentation**

```bash
git add README.md docs/deployment/cloudflare-pages.md
git commit -m "docs: add cloudflare pages operations runbook"
```

- [ ] **Step 6: Final ship check**

Run:

```bash
curl -I https://<project>.pages.dev
curl -I https://<custom-domain>
```

Expected:
- both endpoints return `200`
- production content matches the latest `main` commit

## Self-Review

- Spec coverage: the plan covers repository prep, Pages provisioning, production/preview behavior, custom domain setup, and runbook / rollback requirements.
- Placeholder scan: any `<project>` or `<custom-domain>` token must be replaced during execution as soon as Cloudflare assigns real values.
- Type consistency: `main` is consistently treated as production, `dev` as preview, and `app/` as the first-stage publish surface.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-29-cloudflare-pages-deployment.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?