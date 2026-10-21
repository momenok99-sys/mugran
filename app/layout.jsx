import './globals.css';
import { headers } from 'next/headers';
import { LanguageProvider } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import ProjectModal from '../components/ProjectModal';
import Footer from '../components/Footer';
import SiteIntro from '../components/SiteIntro';
import BackToTop from '../components/BackToTop';
import { getPageMetadata, getPageSchema, getRouteInfo } from '../lib/seo';

export function generateMetadata() {
  return getPageMetadata(headers().get('x-mugran-pathname') || '/');
}

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }) {
  const pathname = headers().get('x-mugran-pathname') || '/';
  const { language } = getRouteInfo(pathname);
  const schema = getPageSchema(pathname);

  return (
    <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />}
        <LanguageProvider>
          <SiteIntro />
          <Navbar />
          <ProjectModal />
          <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>{children}</main>
          <Footer />
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}
