import { readFile, readdir, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { loadEnv } from 'vite';

const root = resolve('dist');
const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const base = (env.BASE_PATH || '').replace(/\/$/, '');
const files = [];
async function walk(folder) {
  for (const item of await readdir(folder, { withFileTypes: true })) {
    const file = join(folder, item.name);
    if (item.isDirectory()) await walk(file);
    else if (item.name.endsWith('.html')) files.push(file);
  }
}
await walk(root);
assert(files.length >= 12, 'Expected bilingual pages and content details.');
let links = 0;
let mathPages = 0;
let codePages = 0;
let fallbacks = 0;
const failures = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  assert(!html.includes('Unpublished draft fixture'), `Draft exposed in ${file}`);
  assert(!file.includes('unpublished-draft'), 'Draft route generated.');
  assert(/<html[^>]+lang=/.test(html), `Missing language in ${file}`);
  assert(/<title>[^<]+<\/title>/.test(html), `Missing title in ${file}`);
  assert(/name="description"/.test(html), `Missing description in ${file}`);
  if (html.includes('data-placeholder="true"')) assert(html.includes('noindex'), `Placeholder page is indexable: ${file}`);
  if (html.includes('class="katex')) mathPages++;
  if (html.includes('astro-code')) codePages++;
  if (html.includes('?untranslated=')) fallbacks++;
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:|tel:)/.test(raw)) continue;
    const url = new URL(raw.replace(/&amp;/g, '&'), `https://local.test/${file.slice(root.length + 1).replaceAll('\\','/')}`);
    let pathname = decodeURIComponent(url.pathname);
    if (base && pathname.startsWith(`${base}/`)) pathname = pathname.slice(base.length);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const target = resolve(root, `.${pathname}`);
    try {
      await access(target);
      if (url.hash && target.endsWith('.html')) {
        const dest = await readFile(target, 'utf8');
        assert(dest.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor ${url.hash}`);
      }
      links++;
    } catch (error) { failures.push(`${file}: ${raw} (${error.message})`); }
  }
}
assert.equal(failures.length, 0, failures.join('\n'));
for (const lang of ['en','zh']) {
  const home = await readFile(join(root,lang,'index.html'),'utf8');
  assert(home.includes('portfolio-theme'), 'Theme preference not initialized.');
}
if (env.SITE_URL) {
  const home = await readFile(join(root,'en/index.html'),'utf8');
  const canonical = new URL(`${base}/en/`, env.SITE_URL).href;
  assert(home.includes(`rel="canonical" href="${canonical}"`), 'Incorrect canonical or base path.');
  const sitemap = await readFile(join(root,'sitemap-0.xml'),'utf8');
  assert(sitemap.includes(canonical), 'Homepage missing from sitemap.');
  assert(!sitemap.includes('unpublished-draft'), 'Draft in sitemap.');
}
console.log(`Verified ${files.length} HTML pages and ${links} local links/assets/anchors. Found ${mathPages} math pages, ${codePages} code pages, and ${fallbacks} translation fallbacks. Draft fixture excluded.`);
