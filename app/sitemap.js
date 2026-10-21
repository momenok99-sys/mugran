import { pagePaths, siteUrl } from '../lib/seo';

export default function sitemap() {
  return pagePaths.flatMap((path) => {
    const en = path === '/' ? '/' : `/en${path}`;
    const ar = `/ar${path === '/' ? '' : path}`;
    const languages = { en: `${siteUrl}${en}`, ar: `${siteUrl}${ar}` };
    return [en, ar].map((url) => ({ url: `${siteUrl}${url}`, alternates: { languages } }));
  });
}
