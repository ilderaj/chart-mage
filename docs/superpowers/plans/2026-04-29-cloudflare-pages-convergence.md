Active task path: `planning/active/cloudflare-pages-deploy/`
Lifecycle state: `blocked`
Sync-back status: `synced on 2026-04-29`

# Cloudflare Pages Convergence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the gap between the live direct-upload Cloudflare Pages fallback and the intended fully automated Git-based production deployment.

**Architecture:** Keep the existing `chart-mage` direct-upload Pages project live as the temporary production endpoint, converge repository documentation and deploy assets into `main`, add a Wrangler-based manual redeploy path, then create a separate Git-integrated Pages project after the Cloudflare GitHub installation issue is fixed. Cut traffic over only after the Git-integrated project proves main auto-deploy and branch / PR preview behavior.

**Tech Stack:** Cloudflare Pages, Wrangler direct upload, GitHub branches, static `app/` publish surface, Cloudflare custom domains, repository runbook documentation.

---

## Current Evidence

- Live production URL: `https://chart-mage.pages.dev/`
- Current Cloudflare Pages project: `chart-mage`
- Project id: `32d49de7-925e-408a-b308-92fe8b24058d`
- Latest deployment id: `010f65fe-098e-41bf-9582-40887adf4630`
- Latest deployment state: `production` / `success`
- Deployment trigger: `ad_hoc`
- Current publish surface: `app/`
- Current gap: direct-upload projects cannot be converted to Git integration, so this project cannot become the final push-to-main deployment target in place.

### Task 1: Reconcile repository deployment files into main

**Files:**
- Create on `main`: `app/_headers`
- Create on `main`: `docs/deployment/cloudflare-pages.md`
- Modify on `main`: `README.md`
- Modify on `main`: `package.json`
- Preserve on `main`: `planning/active/cloudflare-pages-deploy/*`

- [ ] **Step 1: Start from current main**

Run:

```bash
git checkout main
git status --short --branch
```

Expected:

```text
## main...origin/main
```

No unrelated working tree changes should be present before applying deployment-file reconciliation.

- [ ] **Step 2: Bring only non-planning deployment files from the deploy branch**

Run:

```bash
git restore --source cloudflare-pages-deploy -- README.md package.json app/_headers docs/deployment/cloudflare-pages.md
```

Expected:
- `README.md` gains the Cloudflare Pages deployment section.
- `package.json` gains `serve:app`, `build`, `build:check`, and `uat:serve` reuses `serve:app`.
- `app/_headers` exists.
- `docs/deployment/cloudflare-pages.md` exists.
- `planning/active/cloudflare-pages-deploy/*` is not restored from the older deploy branch.

- [ ] **Step 3: Verify the restored file set**

Run:

```bash
git diff --name-status
git diff --check
```

Expected changed files:

```text
M README.md
A app/_headers
A docs/deployment/cloudflare-pages.md
M package.json
```

- [ ] **Step 4: Verify local static hosting still works**

Run:

```bash
npm run serve:app
```

In another terminal, run:

```bash
curl -I http://127.0.0.1:8000/intro.html
curl -I 'http://127.0.0.1:8000/index.html?maestro=1'
```

Expected:
- both local URLs return `200`

- [ ] **Step 5: Verify the fallback build check still works**

Run:

```bash
npm run build:check
```

Expected:
- Gulp exits with code `0`.

- [ ] **Step 6: Commit repository convergence**

Run:

```bash
git add README.md package.json app/_headers docs/deployment/cloudflare-pages.md
git commit -m "chore: converge cloudflare pages deployment files"
```

### Task 2: Add a safe manual redeploy fallback using Wrangler

**Files:**
- Modify: `package.json`
- Modify: `docs/deployment/cloudflare-pages.md`
- Optional create: `scripts/deploy-pages-direct.sh`

- [ ] **Step 1: Add Wrangler as a development dependency**

Run:

```bash
npm install --save-dev wrangler@latest
```

Expected:
- `package.json` contains `wrangler` in `devDependencies`.
- `package-lock.json` is updated if present.

- [ ] **Step 2: Add direct upload scripts**

Update `package.json` scripts:

```json
{
  "scripts": {
    "pages:deploy": "wrangler pages deploy app --project-name chart-mage --branch main",
    "pages:deploy:preview": "wrangler pages deploy app --project-name chart-mage --branch dev",
    "pages:list": "wrangler pages deployment list --project-name chart-mage"
  }
}
```

Keep existing scripts unchanged.

- [ ] **Step 3: Document authentication and deploy usage**

Append to `docs/deployment/cloudflare-pages.md`:

```md
## Manual redeploy while Git integration is blocked

This project is currently a direct-upload Pages project, so production redeploys must be started manually from an authenticated operator environment.

```bash
npm run pages:deploy
```

Preview-style manual deployment to the `dev` branch alias:

```bash
npm run pages:deploy:preview
```

List recent deployments:

```bash
npm run pages:list
```

Wrangler must be authenticated with an account that can manage the `chart-mage` Pages project.
```

- [ ] **Step 4: Dry-run validation without deploying**

Run:

```bash
npx wrangler --version
npm run pages:list
```

Expected:
- Wrangler prints a version.
- Deployment list includes deployment `010f65fe` or a newer deployment.

- [ ] **Step 5: Commit manual redeploy fallback**

Run:

```bash
git add package.json package-lock.json docs/deployment/cloudflare-pages.md
git commit -m "chore: add cloudflare pages direct upload fallback commands"
```

### Task 3: Recover the intended Git-integrated deployment path

**Files:**
- Modify: `docs/deployment/cloudflare-pages.md`
- Configure: Cloudflare Pages GitHub integration
- Test: Git-integrated Pages project deploys from `main`

- [ ] **Step 1: Confirm the Cloudflare GitHub installation is repaired**

In the Cloudflare dashboard, verify that Pages can access the GitHub repository:

```text
Workers & Pages -> Create application -> Pages -> Connect to Git -> ilderaj/chart-mage is selectable
```

If API creation is retried, the previous error must not recur:

```text
8000011
```

- [ ] **Step 2: Create a new Git-integrated project rather than converting the direct-upload project**

Use a temporary project name first:

```text
Project name: chart-mage-git
Repository: ilderaj/chart-mage
Production branch: main
Framework preset: None
Build command: (empty)
Build output directory: app
Root directory: /
```

Expected:
- Cloudflare creates a new project such as `https://chart-mage-git.pages.dev`.
- First deployment uses a Git trigger, not `ad_hoc`.

- [ ] **Step 3: Verify production deployment from main**

Run:

```bash
curl -I https://chart-mage-git.pages.dev/
curl -L -o /dev/null -w 'status=%{http_code} final=%{url_effective}\n' 'https://chart-mage-git.pages.dev/index.html?maestro=1'
```

Expected:
- root returns `200`
- app entry returns `200`
- response headers include `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy`

- [ ] **Step 4: Verify preview behavior from dev**

Run:

```bash
git checkout dev
git merge --ff-only main
git push origin dev
```

Expected:
- `dev.chart-mage-git.pages.dev` is created or updated.
- Preview deployment returns `200`.
- Production `chart-mage-git.pages.dev` remains tied to `main`.

- [ ] **Step 5: Verify PR preview behavior**

Open a small same-repository PR from a branch such as `cloudflare-preview-check` into `main`.

Expected:
- Cloudflare posts or exposes a unique preview deployment for the PR.
- New commits to the PR branch update the preview.

- [ ] **Step 6: Document the Git-integrated recovery**

Update `docs/deployment/cloudflare-pages.md`:

```md
## Git-integrated project

- Project name: `chart-mage-git`
- Production branch: `main`
- Production URL: `https://chart-mage-git.pages.dev`
- Preview branch alias: `https://dev.chart-mage-git.pages.dev`
```

- [ ] **Step 7: Commit Git integration documentation**

Run:

```bash
git add docs/deployment/cloudflare-pages.md
git commit -m "docs: record git-integrated cloudflare pages project"
```

### Task 4: Cut over production naming and domain routing

**Files:**
- Modify: `README.md`
- Modify: `docs/deployment/cloudflare-pages.md`
- Configure: Cloudflare Pages custom domain settings
- Test: final production endpoint

- [ ] **Step 1: Choose the production endpoint strategy**

Pick one strategy before changing traffic:

```text
Option A: Keep chart-mage.pages.dev as the public URL and replace the direct-upload project after Git integration works.
Option B: Attach a custom domain to the Git-integrated project and leave chart-mage.pages.dev as fallback.
```

Recommendation: use Option B if a custom domain is available, because it avoids deleting the already-live fallback project during cutover.

- [ ] **Step 2: Attach the custom domain to the Git-integrated project**

For a subdomain:

```text
Pages project chart-mage-git -> Custom domains -> Set up a domain -> app.example.com
DNS: CNAME app.example.com -> chart-mage-git.pages.dev
```

For an apex domain managed by Cloudflare:

```text
Pages project chart-mage-git -> Custom domains -> Set up a domain -> example.com
Allow Cloudflare to create the required DNS record.
```

- [ ] **Step 3: Verify the custom domain**

Run:

```bash
curl -I https://app.example.com/
curl -L -o /dev/null -w 'status=%{http_code} final=%{url_effective}\n' 'https://app.example.com/index.html?maestro=1'
```

Expected:
- TLS certificate is valid.
- both requests return `200`.
- content matches the latest `main` deployment.

- [ ] **Step 4: Update public documentation to the final URL**

Update README deployment section:

```md
- Production URL: `https://app.example.com`
- Fallback URL: `https://chart-mage.pages.dev`
```

If no custom domain is used, document the chosen `pages.dev` URL instead.

- [ ] **Step 5: Commit production endpoint documentation**

Run:

```bash
git add README.md docs/deployment/cloudflare-pages.md
git commit -m "docs: record final cloudflare pages production endpoint"
```

### Task 5: Clean up fallback state after Git automation is proven

**Files:**
- Modify: `planning/active/cloudflare-pages-deploy/task_plan.md`
- Modify: `planning/active/cloudflare-pages-deploy/findings.md`
- Modify: `planning/active/cloudflare-pages-deploy/progress.md`
- Optional configure: Cloudflare Pages old fallback project

- [ ] **Step 1: Require evidence before cleanup**

Collect these proof points:

```text
1. Git-integrated project production deployment from main succeeded.
2. dev branch preview deployment succeeded.
3. PR preview deployment succeeded.
4. Final public endpoint returns 200.
5. README and runbook name the final endpoint.
```

- [ ] **Step 2: Decide what to do with the direct-upload project**

Choose one:

```text
Option A: Keep `chart-mage` direct-upload as emergency fallback.
Option B: Delete `chart-mage` after custom domain and Git project are stable.
```

Recommendation: keep it for one release cycle, then delete or clearly mark it as fallback.

- [ ] **Step 3: Remove stale local worktrees**

After all needed commits are merged:

```bash
git worktree remove .worktrees/cloudflare-pages-deploy
git worktree prune
```

Expected:
- no worktree remains for completed deployment branches.

- [ ] **Step 4: Update tracked planning files**

Set `planning/active/cloudflare-pages-deploy/task_plan.md`:

```md
## Current State
Status: waiting_review
Archive Eligible: no
Close Reason: Cloudflare Pages production and preview deployment are verified through Git integration, with direct-upload fallback state documented.
```

Update `findings.md` and `progress.md` with final URLs, deployment ids, preview evidence, and fallback decision.

- [ ] **Step 5: Commit planning closure update**

Run:

```bash
git add planning/active/cloudflare-pages-deploy/task_plan.md planning/active/cloudflare-pages-deploy/findings.md planning/active/cloudflare-pages-deploy/progress.md
git commit -m "docs: update cloudflare pages deployment status"
```

## Self-Review

- Spec coverage: this plan covers repository convergence, manual fallback deploys, Git integration recovery, preview verification, domain cutover, and cleanup.
- Constraint coverage: it explicitly handles the Cloudflare constraint that Direct Upload projects cannot be converted to Git integration.
- Open input: custom-domain steps require the actual domain name before execution. Until then, `pages.dev` remains the verified production endpoint.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-29-cloudflare-pages-convergence.md`. Recommended execution order:

1. Execute Task 1 now to bring deployment files into `main`.
2. Execute Task 2 if manual redeploys should be repeatable before Git integration is repaired.
3. Wait for Cloudflare GitHub installation recovery before Tasks 3-5.