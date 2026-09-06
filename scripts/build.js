// Production build: validate the pages in site/ and copy them to public/.
// Fails (exit 1) on anything that would ship broken: a missing page, a leftover
// preview/artifact URL, a localhost reference, or an internal link with no target.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'site');
const OUT = path.join(ROOT, 'public');
const PAGES = ['index.html', 'services/index.html', 'team/index.html'];
const ROUTES = new Set(['/', '/services', '/team']);
const errors = [];

for (const rel of PAGES) {
  const file = path.join(SRC, rel);
  if (!fs.existsSync(file)) { errors.push(`missing page: site/${rel}`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  if (!/^<!doctype html>/i.test(html)) errors.push(`${rel}: no <!doctype html>`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${rel}: no <title>`);
  if (/claude\.ai\/code\/artifact/.test(html)) errors.push(`${rel}: still links to a claude.ai artifact`);
  if (/localhost|127\.0\.0\.1/.test(html)) errors.push(`${rel}: references localhost`);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|sms:|data:)/.test(href)) continue;
    const [p, hash] = href.split('#');
    if (p && !ROUTES.has(p) && !fs.existsSync(path.join(SRC, p.replace(/^\//, '')))) errors.push(`${rel}: link to unknown route "${href}"`);
    if (hash && p === '' && !ids.has(hash)) errors.push(`${rel}: anchor "#${hash}" has no target on this page`);
  }
}

if (errors.length) {
  console.error('Build failed:\n  ' + errors.join('\n  '));
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true });
const size = PAGES.reduce((n, p) => n + fs.statSync(path.join(OUT, p)).size, 0);
console.log(`Build OK: ${PAGES.length} pages, ${(size / 1024 / 1024).toFixed(2)} MB -> public/`);
