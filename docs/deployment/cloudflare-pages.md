# Cloudflare deployment

## Primary Worker deployment

- Worker name: `chartmage`
- Production URL: `https://chartmage.paymond.me`
- Worker fallback URL: `https://chartmage.ilderaj.workers.dev`
- Preview URL for `dev`: `https://dev-chartmage.ilderaj.workers.dev`
- Current mode: GitHub-connected Cloudflare Workers Builds
- Production trigger: pushes / merges to `main` run `npm run build` and `npx wrangler deploy`
- Non-production trigger: non-`main` branches run `npm run build` and `npx wrangler versions upload`
- Config file: `wrangler.jsonc`
- Asset output directory: `dist`
- Custom domain: `chartmage.paymond.me` attached to Worker `chartmage`

Use this path as the primary automatic deployment flow:

1. Commit local changes on `dev`.
2. Push `dev` to `origin/dev`.
3. Open a PR from `dev` to `main` and wait for the `Workers Builds: chartmage` check.
4. Merge the PR into `main`; Cloudflare Workers Builds publishes production automatically.
5. Verify the production custom domain after the build succeeds.

Local verification before pushing:

```bash
npm run build:check
npx wrangler deploy --dry-run
```

Manual production deploy from an authenticated operator environment:

```bash
npm run deploy
```

Local Worker preview:

```bash
npm run preview
```

## Domain notes

The production hostname is `chartmage.paymond.me`. Cloudflare attaches it as a Worker custom domain for the `paymond.me` zone and creates a read-only proxied `AAAA 100::` DNS record for the hostname.

The free Worker URL still uses the account `workers.dev` subdomain: `chartmage.ilderaj.workers.dev`. Keep it as a fallback and low-level Worker sanity check, but treat `https://chartmage.paymond.me` as the public production URL.

`chartmage.pages.dev` cannot be assigned to this Worker because `*.pages.dev` hostnames belong to Cloudflare Pages projects. For a shorter or branded production URL, attach a custom domain to the Worker, or keep the existing Pages project as a separate fallback endpoint.

## Pages fallback

- Pages project name: `chart-mage`
- Pages URL: `https://chart-mage.pages.dev`
- Current mode: direct upload fallback
- Current limitation: no automatic Git-based production or preview deployments until the Cloudflare Pages GitHub installation is repaired
- Blocker: Cloudflare Pages Git installation issue (`8000011`)

## Direct-upload redeploy

Use the already-live `chart-mage` Pages project for manual redeploys until Git integration is repaired.

1. Build or prepare the static site output from the repository as needed for release.
2. Upload the publish directory for the existing Pages project by using the approved Cloudflare Pages direct-upload workflow from an authenticated operator environment.
3. Wait for the deployment to finish, then verify the production site at `https://chart-mage.pages.dev`.

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

Wrangler must be authenticated with an account that can manage the `chart-mage` Pages project. Use `npx wrangler login` if the current environment is not already authenticated.

## Notes

This fallback keeps the Pages URL live while the Cloudflare Pages GitHub installation issue is unresolved. The Worker deployment is now the primary automatic path; restore Pages Git integration only if the project needs `*.pages.dev` automation specifically.
