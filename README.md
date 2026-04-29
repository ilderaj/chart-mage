# Chart Mage
Generate sequence diagrams and flowcharts at lightning speed, in a similar manner as markdown.

![sequence](./app/images/sequence-lg@2x.png)

![flowchart](./app/images/flowchart-lg@2x.png)

### No more fiddling the layout
Keep your hands on the keyboard and let Chart Mage takes care of the drawing.
![layout](./app/images/layout@2x.gif)

### Smart autocompletion
Chart Mage makes reasonable guess about what you are going to type.
![autocompletion](./app/images/autocomplete@2x.gif)

### Simple syntax
Just look at the sentences. You can learn it in 10 seconds.
![syntax](./app/images/syntax@2x.png)

### Tech
Many thanks to the cool projects [mermaid](https://mermaidjs.github.io/), [Codemirror](https://codemirror.net/), [Underscore](https://underscorejs.org/), [node-uuid](https://github.com/broofa/node-uuid), [jQuery Modal](https://jquerymodal.com/), [base16](https://github.com/chriskempson/base16). Chart Mage was made possible by them.

### Note
I built Chart Mage three years ago when I taught myself to code. The code is messy and the comments are in Chinese. So the next thing I will do is to tidy up the code and translate the comments into English. 

### UAT with Maestro
Chart Mage now uses [Maestro](https://github.com/mobile-dev-inc/maestro) as the default UAT framework for browser-based end-to-end checks.

#### Install prerequisites
- On macOS, `npm run maestro:install` will install `openjdk@17` through Homebrew if Java is missing, then install Maestro CLI.
- On other environments, make sure Java 17 or newer is already available before running the installer.

#### Run the smoke UAT flow
1. Start the local app server with `npm run uat:serve`.
2. In another terminal, run `npm run uat:smoke`.

The default smoke flow opens the local web app, creates a flowchart, and checks that the editor, preview, and saved chart list are visible.
It opens `index.html?maestro=1`, which seeds the `visited` flag in-place, clears browser state up front, and relies on stable id-based selectors for the main UAT entry points.

Additional validated flows live alongside the smoke flow:
- `.maestro/flows/web-create-sequence.yaml`
- `.maestro/flows/web-rename-chart.yaml`
- `.maestro/flows/web-delete-chart.yaml`

They cover sequence creation plus rename/delete behavior in the charts drawer and its follow-up modals.

#### Where tests live
- Maestro workspace: `.maestro/`
- Initial smoke flow: `.maestro/flows/web-smoke.yaml`
- Helper scripts: `scripts/install-maestro.sh` and `scripts/run-maestro-web-smoke.sh`

For future UAT coverage, add more YAML flows under `.maestro/flows/` and run them with the same CLI entrypoint.

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
