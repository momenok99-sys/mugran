import { businessIdentity } from './businessIdentity';

export const siteUrl = businessIdentity.website;

export const pagePaths = ['/', '/about', '/approach', '/services', '/services/brand', '/services/web', '/services/creative', '/contact'];

const pages = {
  '/': {
    en: ['Mugran Creative | Branding & Digital Experiences Dubai', 'Mugran Creative is a Dubai-based independent creative agency building distinctive brands, websites, digital experiences and creative communication.'],
    ar: ['مُقرن الإبداعية | تصميم الهويات والتجارب الرقمية في دبي', 'مُقرن وكالة إبداعية مستقلة في دبي تبني العلامات التجارية وتصمم التجارب الرقمية والتواصل الإبداعي للشركات الطموحة.'],
  },
  '/about': {
    en: ['About Mugran Creative | Independent Creative Agency Dubai', 'Learn about Mugran Creative, an independent Dubai agency connecting brand strategy, digital design and creative communication.'],
    ar: ['عن مُقرن | وكالة إبداعية مستقلة في دبي', 'تعرّف على مُقرن، وكالة إبداعية مستقلة في دبي تربط بين استراتيجية العلامة والتصميم الرقمي والتواصل الإبداعي.'],
  },
  '/approach': {
    en: ['Our Approach | Strategy Before Design | Mugran Creative', 'See how Mugran starts with the business challenge, defines what matters and builds connected brand and digital experiences.'],
    ar: ['منهجنا | نفهم قبل أن نصنع | مُقرن', 'تعرّف على منهج مُقرن الذي يبدأ بفهم تحديات العمل وتحديد ما يهم قبل بناء العلامة والتجربة الرقمية.'],
  },
  '/work': {
    en: ['Our Work | Brand & Digital Projects | Mugran Creative', 'Explore the brand, digital and creative work presented by Mugran Creative.'],
    ar: ['أعمالنا | مشاريع العلامة والتجارب الرقمية | مُقرن', 'استكشف أعمال العلامة التجارية والتجارب الرقمية والإبداعية التي تعرضها مُقرن.'],
  },
  '/services': {
    en: ['Creative Services | Brand, Web & Campaigns | Mugran', 'Explore Mugran Creative’s brand strategy, identity, website, digital experience and creative campaign services in Dubai.'],
    ar: ['خدمات مُقرن | العلامة والويب والحملات الإبداعية', 'استكشف خدمات مُقرن في استراتيجية العلامة والهوية وتصميم المواقع والتجارب الرقمية والحملات الإبداعية في دبي.'],
  },
  '/services/brand': {
    en: ['Brand Strategy & Identity | Mugran Creative Dubai', 'Mugran builds brand positioning, visual identities, brand systems and guidelines for businesses ready for change.'],
    ar: ['استراتيجية العلامة والهوية البصرية | مُقرن دبي', 'تبني مُقرن تموضع العلامة والهوية البصرية وأنظمتها وإرشاداتها للشركات التي تستعد للتغيير.'],
  },
  '/services/web': {
    en: ['Website Design & Digital Experiences | Mugran Dubai', 'Mugran designs and develops business websites, landing pages, UX/UI and digital experiences that clarify value and action.'],
    ar: ['تصميم المواقع والتجارب الرقمية | مُقرن دبي', 'تصمم مُقرن مواقع الشركات وصفحات الهبوط وتجارب المستخدم وتطور تجارب رقمية تجعل قيمة العمل أوضح.'],
  },
  '/services/creative': {
    en: ['Creative Direction & Campaigns | Mugran Dubai', 'Mugran develops campaign concepts, art direction, launch assets and creative communication rooted in a coherent brand.'],
    ar: ['التوجيه الإبداعي والحملات | مُقرن دبي', 'تطور مُقرن أفكار الحملات والتوجيه الفني وأصول الإطلاق والتواصل الإبداعي المنسجم مع العلامة.'],
  },
  '/contact': {
    en: ['Contact Mugran Creative | Start a Project in Dubai', 'Tell Mugran Creative about your brand, website or campaign challenge. Contact our Dubai-based independent agency.'],
    ar: ['تواصل مع مُقرن | ابدأ مشروعك في دبي', 'أخبر مُقرن عن تحديات علامتك أو موقعك أو حملتك وتواصل مع وكالتنا الإبداعية المستقلة في دبي.'],
  },
};

export function getRouteInfo(pathname) {
  const language = pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en';
  const barePath = pathname.replace(/^\/(en|ar)(?=\/|$)/, '') || '/';
  const known = Boolean(pages[barePath]);
  const path = known ? barePath : '/';
  const canonicalPath = language === 'ar' ? `/ar${path === '/' ? '' : path}` : (path === '/' ? '/' : `/en${path}`);
  return { language, path, canonicalPath, isAlias: pathname !== canonicalPath, known };
}

export function getPageMetadata(pathname) {
  const { language, path, canonicalPath, isAlias, known } = getRouteInfo(pathname);
  if (!known) return { title: 'Page not found | Mugran Creative', robots: { index: false, follow: true } };
  const [title, description] = pages[path][language];
  const englishPath = path === '/' ? '/' : `/en${path}`;
  const arabicPath = `/ar${path === '/' ? '' : path}`;
  return {
    metadataBase: new URL(siteUrl), title, description,
    robots: { index: !isAlias && path !== '/work', follow: true },
    alternates: { canonical: canonicalPath, languages: { en: englishPath, ar: arabicPath, 'x-default': englishPath } },
    openGraph: {
      type: 'website', siteName: businessIdentity.name, locale: language === 'ar' ? 'ar_AE' : 'en_AE',
      alternateLocale: language === 'ar' ? ['en_AE'] : ['ar_AE'], url: canonicalPath, title, description,
    },
    twitter: { card: 'summary', title, description },
    icons: [{ rel: 'icon', url: '/gr logo.svg' }],
  };
}

export function getPageSchema(pathname) {
  const { language, path, canonicalPath, known } = getRouteInfo(pathname);
  if (!known || path === '/work') return null;
  const [title, description] = pages[path][language];
  const url = `${siteUrl}${canonicalPath}`;
  const organization = {
    '@type': 'Organization', '@id': businessIdentity.organizationId, name: businessIdentity.name,
    url: `${siteUrl}/`, email: businessIdentity.email,
    sameAs: businessIdentity.socialProfiles.map(({ url: profileUrl }) => profileUrl),
    contactPoint: {
      '@type': 'ContactPoint', contactType: 'customer service',
      telephone: businessIdentity.whatsapp.telephone, url: businessIdentity.whatsapp.url,
      availableLanguage: ['en', 'ar'],
    },
    areaServed: [{ '@type': 'AdministrativeArea', name: 'Dubai' }, { '@type': 'Country', name: 'United Arab Emirates' }],
  };
  const website = { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: businessIdentity.name, publisher: { '@id': organization['@id'] } };
  const webpage = { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: language, isPartOf: { '@id': website['@id'] }, about: { '@id': organization['@id'] } };
  const graph = [organization, website, webpage];
  const serviceNames = {
    '/services/brand': { en: 'Brand Strategy and Identity', ar: 'استراتيجية العلامة والهوية البصرية' },
    '/services/web': { en: 'Website Design and Digital Experiences', ar: 'تصميم المواقع والتجارب الرقمية' },
    '/services/creative': { en: 'Creative Direction and Campaigns', ar: 'التوجيه الإبداعي والحملات' },
  };
  if (serviceNames[path]) {
    const service = {
      '@type': 'Service', '@id': `${url}#service`, url,
      name: serviceNames[path][language], description,
      provider: { '@id': organization['@id'] },
      areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
      mainEntityOfPage: { '@id': webpage['@id'] },
    };
    webpage.mainEntity = { '@id': service['@id'] };
    graph.push(service);
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
