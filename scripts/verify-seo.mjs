import assert from 'node:assert/strict';

const origin = process.env.SEO_TEST_ORIGIN || 'http://127.0.0.1:3107';
const site = 'https://www.mugranagency.com';
const officialProfiles = [
  'https://www.instagram.com/mugranagency',
  'https://www.tiktok.com/@mugranagency',
  'https://www.linkedin.com/company/mugranagency/',
  'https://www.facebook.com/profile.php?id=61594199871461',
];
const whatsapp = 'https://wa.me/971502675375';
const paths = ['/', '/about', '/approach', '/services', '/services/brand', '/services/web', '/services/creative', '/contact'];
const canonicalRoutes = paths.flatMap((path) => [path === '/' ? '/' : `/en${path}`, `/ar${path === '/' ? '' : path}`]);
const titles = new Set();
const descriptions = new Set();
const internalLinks = new Set();

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
  assert.ok(html.includes(`<meta property="og:site_name" content="Mugran Creative"`), `${route} Open Graph identity`);
  assert.ok(html.includes(`<meta property="og:url" content="${site}${route === '/' ? '' : route}"`), `${route} Open Graph URL`);
  assert.ok(html.includes('<meta name="twitter:card" content="summary"'), `${route} Twitter card`);
  const barePath = route.replace(/^\/(en|ar)(?=\/|$)/, '') || '/';
  const englishUrl = `${site}${barePath === '/' ? '' : `/en${barePath}`}`;
  const arabicUrl = `${site}/ar${barePath === '/' ? '' : barePath}`;
  assert.ok(html.includes(`<link rel="alternate" hrefLang="en" href="${englishUrl}"`), `${route} English alternate`);
  assert.ok(html.includes(`<link rel="alternate" hrefLang="ar" href="${arabicUrl}"`), `${route} Arabic alternate`);
  assert.match(html, /application\/ld\+json/, `${route} JSON-LD`);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
  const organizations = schema['@graph'].filter((entity) => entity['@type'] === 'Organization');
  assert.equal(organizations.length, 1, `${route} one Organization entity`);
  const organization = organizations[0];
  assert.equal(organization['@id'], `${site}/#organization`, `${route} stable organization`);
  assert.equal(organization.name, 'Mugran Creative', `${route} business name`);
  assert.equal(organization.url, `${site}/`, `${route} business URL`);
  assert.deepEqual(organization.sameAs, officialProfiles, `${route} official sameAs`);
  assert.ok(!organization.sameAs.includes(whatsapp), `${route} WhatsApp not sameAs`);
  assert.equal(organization.contactPoint.url, whatsapp, `${route} WhatsApp contact URL`);
  assert.equal(organization.contactPoint.telephone, '+971502675375', `${route} WhatsApp contact number`);
  assert.deepEqual(organization.contactPoint.availableLanguage, ['en', 'ar'], `${route} contact languages`);
  const website = schema['@graph'].find((entity) => entity['@type'] === 'WebSite');
  const webpage = schema['@graph'].find((entity) => entity['@type'] === 'WebPage');
  assert.equal(website.publisher['@id'], organization['@id'], `${route} WebSite publisher`);
  assert.equal(webpage.about['@id'], organization['@id'], `${route} WebPage about`);
  const service = schema['@graph'].find((entity) => entity['@type'] === 'Service');
  if (barePath.startsWith('/services/')) {
    assert.ok(service, `${route} Service entity`);
    assert.equal(service.provider['@id'], organization['@id'], `${route} Service provider`);
    assert.equal(webpage.mainEntity['@id'], service['@id'], `${route} WebPage main entity`);
  } else {
    assert.equal(service, undefined, `${route} no unsupported Service entity`);
  }
  for (const profile of [...officialProfiles, whatsapp]) {
    assert.ok(html.includes(`href="${profile.replace(/&/g, '&amp;')}"`), `${route} official visible link ${profile}`);
    assert.ok(new RegExp(`<a[^>]+href="${profile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]+target="_blank"[^>]+rel="noopener noreferrer"`).test(html), `${route} secure new-tab link ${profile}`);
  }
  if (language === 'en') assert.ok(html.includes('href="/en/about"'), `${route} canonical English footer navigation`);
  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"]*)"/g)) {
    if (!match[1].startsWith('//')) internalLinks.add(match[1].split(/[?#]/)[0]);
  }
  assert.doesNotMatch(html, /<meta name="robots" content="noindex/, `${route} indexable`);
}
assert.equal(titles.size, canonicalRoutes.length, 'unique titles');
assert.equal(descriptions.size, canonicalRoutes.length, 'unique descriptions');

for (const link of internalLinks) {
  const response = await fetch(`${origin}${link}`);
  assert.ok(response.status < 400, `internal link ${link} status ${response.status}`);
}

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

console.log(`Validated ${canonicalRoutes.length} canonical routes, ${internalLinks.size} internal link targets, 3 aliases, robots and sitemap.`);
