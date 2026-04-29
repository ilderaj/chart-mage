# Findings

- README currently uses the original project voice, including the note from the original author about learning to code and future cleanup.
- Existing app pages already have a Stripe-inspired design language documented in `DESIGN.md` and partially applied to `intro.html`, `index.html`, and `browser.html`.
- Repo memory says production direction is Cloudflare Pages from `main`, with the static `app/` directory as the first deployment target.
- Repo memory says Maestro browser UAT is installed and smoke plus create/rename/delete flows have passed locally.
- Search found original contact paths still present in public app pages, including legacy feedback email links in `app/intro.html`, `app/index.html`, and generated `dist/` files.
- Search found legacy Google Analytics ID `UA-86337828-1` in app and dist pages; this should be considered for privacy/ownership cleanup in roadmap.
- `package.json` still lists `author: Junlin Shang`; this may need future metadata ownership review while preserving original-project credit.
- MIT license credits `Copyright (c) 2019 Junlin`; README must preserve license/credit clarity instead of implying this fork authored the original project.
- `.gitignore` does not ignore `planning/`, so the roadmap can be private by convention and placement only; it should be clearly labeled internal/private and not linked from public docs.
- `app/js/app.js` is a single jQuery-era controller/view/model file with legacy Chinese comments, CodeMirror simple modes, localStorage persistence, and Mermaid rendering. Good roadmap modernization targets include modularization, parser normalization, dependency upgrades, and test coverage.
- Flowchart parsing already accepts full-width question marks in decision nodes, but sequence message parsing currently keys on ASCII colon. A future UX improvement should normalize full-width colon `：` to `:` before parsing or at editor input time.
