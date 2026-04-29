# Chart Mage

Chart Mage is a local-first web app for drafting sequence diagrams and flowcharts from plain text. This maintained fork keeps the original keyboard-driven idea, updates the visual system, and is being modernized around a static deployment and browser-based UAT workflow.

## Original Project Credit

Chart Mage was originally created by Junlin Shang. This repository is a maintained fork of the original project: [heyjunlin/chart-mage](https://github.com/heyjunlin/chart-mage).

The fork preserves that credit while moving current maintenance, design work, testing, and deployment forward independently.

## What It Does

- Turns readable text syntax into Mermaid-backed sequence diagrams and flowcharts.
- Keeps charts in the browser with local storage by default.
- Provides live preview, autocomplete, quick insert shortcuts, chart library management, rename/delete flows, and PNG export.
- Uses a refreshed design language documented in [DESIGN.md](DESIGN.md).
- Runs as a static app from the `app/` directory.

## Project Direction

This fork is focused on five workstreams:

- Clear fork identity, original-project credit, and cleanup of stale personal-contact paths.
- Full design-system alignment across the intro page, editor, modals, drawers, and fallback screens.
- Better authoring ergonomics, including more forgiving syntax normalization such as converting full-width punctuation to parser-friendly ASCII where appropriate.
- Modernization of the seven-year-old frontend stack, build tooling, parser boundaries, storage model, and test coverage.
- Reliable static distribution through Cloudflare Pages, with reproducible local and preview workflows.

## Local Development

Install dependencies if you need the npm scripts:

```sh
npm install
```

Start the static app server:

```sh
npm run uat:serve
```

Then open:

```text
http://127.0.0.1:8000/intro.html
```

The editor entry point is:

```text
http://127.0.0.1:8000/index.html
```

For automation or direct editor testing, use:

```text
http://127.0.0.1:8000/index.html?maestro=1
```

## UAT With Maestro

Chart Mage uses [Maestro](https://github.com/mobile-dev-inc/maestro) for browser-based end-to-end checks.

Install prerequisites on macOS:

```sh
npm run maestro:install
```

Run the default smoke flow:

```sh
npm run uat:smoke
```

The smoke flow opens the local app, creates a flowchart, and checks that the editor, preview, and saved chart list are visible. It uses `index.html?maestro=1`, which seeds the `visited` flag in place, clears browser state up front, and relies on stable id-based selectors for the main UAT entry points.

Additional validated flows live alongside the smoke flow:

- `.maestro/flows/web-create-sequence.yaml`
- `.maestro/flows/web-rename-chart.yaml`
- `.maestro/flows/web-delete-chart.yaml`

They cover sequence creation plus rename/delete behavior in the charts drawer and its follow-up modals.

## Repository Layout

- `app/` - static application source served in development and initial deployment.
- `app/js/app.js` - current legacy application logic for storage, editor setup, rendering, chart management, and export.
- `app/css/design-tokens.css` - shared design tokens for the refreshed UI.
- `DESIGN.md` - design language reference for ongoing redesign work.
- `.maestro/` - browser UAT workspace and flows.
- `scripts/` - helper scripts for Maestro installation and smoke execution.
- `planning/` - internal task planning notes for active maintenance work.

## Deployment Notes

The current deployment direction is Cloudflare Pages with `main` as the production branch target. The first deployment path serves the static `app/` directory directly to avoid coupling production availability to the legacy Gulp build chain.

## Technology Credit

Chart Mage builds on the work of several open source projects, including [Mermaid](https://mermaid.js.org/), [CodeMirror](https://codemirror.net/), [Underscore](https://underscorejs.org/), [jQuery Modal](https://jquerymodal.com/), [node-uuid](https://github.com/broofa/node-uuid), [Pure CSS](https://purecss.io/), and [base16](https://github.com/chriskempson/base16).

## License

This project is available under the MIT License. See [LICENSE](LICENSE) for the original license text and copyright notice.
