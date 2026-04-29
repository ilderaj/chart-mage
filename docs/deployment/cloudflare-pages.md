# Cloudflare Pages deployment

- Project name: `chart-mage`
- Production URL: `https://chart-mage.pages.dev`
- Current mode: direct upload fallback
- Current limitation: no automatic Git-based production or preview deployments until the Cloudflare Pages GitHub installation is repaired
- Blocker: Cloudflare Pages Git installation issue (`8000011`)
- Intended target state: Git integration from `main`

## Direct-upload redeploy

Use the already-live `chart-mage` Pages project for manual redeploys until Git integration is repaired.

1. Build or prepare the static site output from the repository as needed for release.
2. Upload the publish directory for the existing Pages project by using the approved Cloudflare Pages direct-upload workflow from an authenticated operator environment.
3. Wait for the deployment to finish, then verify the production site at `https://chart-mage.pages.dev`.

## Notes

This fallback keeps production live while the Cloudflare Pages GitHub installation issue is unresolved. Restore the intended Git-integrated deployment flow from `main` after the Cloudflare-side installation problem is repaired.
