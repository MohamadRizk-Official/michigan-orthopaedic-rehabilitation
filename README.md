# Michigan Orthopaedic Rehabilitation website

Static marketing site for Michigan Orthopaedic Rehabilitation (Royal Oak and Troy, MI).
Three self-contained HTML pages. No framework, no server code, no environment variables.

| Route       | Source file                |
|-------------|----------------------------|
| `/`         | `site/index.html`          |
| `/services` | `site/services/index.html` |
| `/team`     | `site/team/index.html`     |
| `/careers`  | `site/careers/index.html`  |
| `/pilates`  | `site/pilates/index.html`  |

Images are embedded in the pages as data URIs, so each page is a single file.
External resources: Google Fonts (Source Serif 4, Public Sans) and three.js r128 from cdnjs
for the hero particle field.

## Develop

```bash
npm run build   # validates site/ and copies it to public/
npm start       # serves public/ at http://localhost:3000 with clean URLs
```

Edit the files under `site/`, never `public/` (it is regenerated on every build and is git-ignored).

## Deploy

Hosted on Vercel. Every push to `main` triggers a production deploy; pull requests get preview URLs.
`vercel.json` sets the build command, output directory, clean URLs and security headers.
No environment variables are required.
