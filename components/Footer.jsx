'use client';

import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa6';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/content';
import { socialLinks } from './socialLinks';
import './FooterPro.css';
import './FooterMicro.css';

const icons = {
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  LinkedIn: FaLinkedinIn,
  Facebook: FaFacebookF,
  WhatsApp: FaWhatsapp,
};

export function SocialIcon({ name }) {
  const Icon = icons[name];
  return Icon ? <Icon aria-hidden="true" /> : null;
}

export default function Footer() {
  const { lang, toggleLang, isRTL } = useLanguage();
  const t = siteContent[lang].footer;
  const [navigation, capabilities] = t.columns;

  const local = (href) => (
    isRTL
      ? (href === '/' ? '/ar' : `/ar${href.replace(/^\/ar/, '')}`)
      : href.replace(/^\/ar/, '') || '/'
  );

  const Links = ({ column }) => (
    <div className="footer-links">
      <h4>{column.title}</h4>
      {column.links.map((link) => (
        <Link key={link.label} href={local(link.href)}>{link.label}</Link>
      ))}
    </div>
  );

  return (
    <footer className="ms-footer">
      <div className="footer-shell">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href={isRTL ? '/ar' : '/'} className="footer-logo">
              <img
                src={isRTL ? '/arlogo.svg' : '/H Logo.svg'}
                alt="Mugran"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <p>{t.type} · {t.location}</p>
            <p className="footer-quote">“{t.quote}”</p>
          </div>

          <Links column={navigation} />
          <Links column={capabilities} />

          <div className="footer-connect">
            <h4>{isRTL ? 'تواصل واجتماعي' : 'CONTACT & SOCIAL'}</h4>
            <a className="footer-email" href="mailto:info@mugranagency.com">
              info@mugranagency.com
            </a>
            <div className="footer-socials">
              {socialLinks.map(({ name, href, ariaLabel }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
                  title={name}
                >
                  <SocialIcon name={name} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t.legal}</span>
          <button onClick={toggleLang}>
            <span aria-hidden="true">◎</span>
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>
        </div>
      </div>
    </footer>
  );
}
