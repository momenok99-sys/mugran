import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import ProjectModal from '../components/ProjectModal';
import Footer from '../components/Footer';
import SiteIntro from '../components/SiteIntro';

export const metadata = {
  title: 'وكالة مُقرَن الإبداعية | اجعل الإدراك يواكب الواقع',
  description: 'مُقرَن وكالة إبداعية مستقلة تساعد الشركات الطموحة على بناء علامات مميزة، وتجارب رقمية واضحة، وحضور إبداعي مؤثر.',
  keywords: ['وكالة إبداعية', 'هوية بصرية', 'تصميم رقمي', 'وكالة مقرن', 'Mugran Creative Agency'],
  authors: [{ name: 'وكالة مُقرَن الإبداعية' }],
  icons: [
    {
      rel: 'icon',
      url: '/gr logo.svg',
    },
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>
          <SiteIntro />
          <Navbar />
          <ProjectModal />
          <main style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
