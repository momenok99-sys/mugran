import LaunchPage from '../../components/LaunchPage';
import { businessIdentity } from '../../lib/businessIdentity';
import localFont from 'next/font/local';

const aeonik = localFont({
  src: [
    { path: '../../public/fonts/aeonik-trial/New Aeonik Trials/AeonikTRIAL-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/aeonik-trial/New Aeonik Trials/AeonikTRIAL-Bold.otf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/aeonik-trial/New Aeonik Trials/AeonikTRIAL-RegularItalic.otf', weight: '400', style: 'italic' },
  ], variable: '--launch-aeonik', display: 'swap',
});
const cairo = localFont({
  src: [
    { path: '../../public/fonts/cairo/Cairo-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/cairo/Cairo-SemiBold.ttf', weight: '600', style: 'normal' },
  ], variable: '--launch-cairo', display: 'swap',
});

const title = 'Landing Page Design & Product Campaigns in Dubai | Mugran Creative';
const description = 'Custom landing pages from AED 899 and five-image product campaigns from AED 599. Explore fast, premium creative services by Mugran Creative in Dubai.';
export const metadata = {
  title, description, metadataBase: new URL(businessIdentity.website),
  robots: { index: true, follow: true },
  alternates: { canonical: '/launch', languages: { en: '/launch', 'x-default': '/launch' } },
  openGraph: { title, description, url: '/launch', type: 'website', siteName: businessIdentity.name, locale: 'en_AE', images: [{ url: '/images/launch/ghostly-hand-behind-blue-glass1.png', alt: 'Mugran Creative launch services' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/images/launch/ghostly-hand-behind-blue-glass1.png'] },
};
export default function Page() { return <div className={`launch-site-frame ${aeonik.variable} ${cairo.variable}`}><LaunchPage /></div>; }

