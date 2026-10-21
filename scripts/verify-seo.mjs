import assert from 'node:assert/strict';

const origin = process.env.SEO_TEST_ORIGIN || 'http://127.0.0.1:3107';
const site = 'https://www.mugranagency.com';
const paths = ['/', '/about', '/approach', '/services', '/services/brand', '/services/web', '/services/creative', '/contact'];
const canonicalRoutes = paths.flatMap((path) => [path === '/' ? '/' : `/en${path}`, `/ar${path === '/' ? '' : path}`]);
const titles = new Set();
const descriptions = new Set();

for (const route of canonicalRoutes) {
  const response = await fetch(`${origin}${route}`);
  assert.equal(response.status, 200, `${route} status`);
  const html = await response.text();
  const language = route.startsWith('/ar') ? 'ar' : 'en';
  assert.match(html, new RegExp(`<html[^>]*lang="${language}"[^>]*dir="${language === 'ar' ? 'rtl' : 'ltr'}"`), `${route} HTML language`);
  assert.match(html, /<h1\b[^>]*>/, `${route} server-rendered heading`);
  assert.match(html, /<title>[^<]+<\/title>/, `${route} title`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${route} description`);
  titles.add(html.match(/<title>([^<]+)<\/title>/)[1]);
  descriptions.add(html.match(/<meta name="description" content="([^"]+)"/)[1]);
  assert.ok(html.includes(`<link rel="canonical" href="${site}${route === '/' ? '' : route}"`), `${route} canonical`);
  assert.ok(html.includes('hrefLang="en"'), `${route} English alternate`);
  assert.ok(html.includes('hrefLang="ar"'), `${route} Arabic alternate`);
  assert.match(html, /application\/ld\+json/, `${route} JSON-LD`);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
  assert.ok(schema['@graph'].some((entity) => entity['@id'] === `${site}/#organization`), `${route} stable organization`);
  assert.doesNotMatch(html, /<meta name="robots" content="noindex/, `${route} indexable`);
}
assert.equal(titles.size, canonicalRoutes.length, 'unique titles');
assert.equal(descriptions.size, canonicalRoutes.length, 'unique descriptions');

for (const [alias, canonical] of [['/en', '/'], ['/about', '/en/about'], ['/services', '/en/services']]) {
  const html = await (await fetch(`${origin}${alias}`)).text();
  assert.ok(html.includes(`<link rel="canonical" href="${site}${canonical === '/' ? '' : canonical}"`), `${alias} canonical`);
  assert.match(html, /<meta name="robots" content="noindex, follow"/, `${alias} noindex alias`);
}

for (const route of ['/work', '/en/work', '/ar/work']) {
  const html = await (await fetch(`${origin}${route}`)).text();
  assert.ok(html.includes('<meta name="robots" content="noindex, follow"'), `${route} noindex while empty`);
}

const missing = await fetch(`${origin}/en/does-not-exist`);
assert.equal(missing.status, 404, 'unknown route status');
const missingHtml = await missing.text();
assert.ok(missingHtml.includes('<meta name="robots" content="noindex, follow"'), 'unknown route noindex');
assert.ok(!missingHtml.includes('<link rel="canonical"'), 'unknown route has no homepage canonical');

const robots = await (await fetch(`${origin}/robots.txt`)).text();
assert.match(robots, /User-Agent: \*/);
assert.match(robots, /Sitemap: https:\/\/www\.mugranagency\.com\/sitemap\.xml/);
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
assert.equal((sitemap.match(/<loc>/g) || []).length, canonicalRoutes.length, 'sitemap URL count');
for (const route of canonicalRoutes) assert.ok(sitemap.includes(`<loc>${site}${route}</loc>`), `${route} in sitemap`);
assert.ok(!sitemap.includes('/work</loc>'), 'empty work pages excluded');

console.log(`Validated ${canonicalRoutes.length} canonical routes, 3 aliases, robots and sitemap.`);
