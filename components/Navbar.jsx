'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';
import { SocialIcon } from './Footer';
import { mobileSocialLinks as social } from './socialLinks';
import './Navbar.css';

export default function Navbar() {
  const { lang = 'ar', isRTL = true, toggleLang, openProjectModal } = useLanguage();
  const path = usePathname() || '/';
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopServicesRef = useRef(null);
  const mobileSubmenuRef = useRef(null);
  const base = isRTL ? '/ar' : '/en';
  const mobileMenuId = 'mugran-mobile-navigation';

  const links = isRTL
    ? [['عن مُقرن', '/about'], ['المنهج', '/approach'], ['تواصل', '/contact']]
    : [['ABOUT', '/about'], ['APPROACH', '/approach'], ['CONTACT', '/contact']];
  const services = isRTL
    ? [['العلامة', 'هوية واستراتيجية تجعل قيمة الشركة أوضح.', '/brand'], ['الويب', 'مواقع وتجارب رقمية تعكس مستوى العمل.', '/web'], ['الإبداع', 'أفكار وحملات ومحتوى يقدّم العلامة للسوق.', '/creative']]
    : [['BRAND', 'Strategy, identity and visual systems.', '/brand'], ['WEB', 'Websites and digital experiences.', '/web'], ['CREATIVE', 'Campaigns, art direction and creative communication.', '/creative']];
  const active = path.startsWith(`${base}/services`);
  const servicesLabel = isRTL ? 'الخدمات' : 'SERVICES';
  const menuLabel = drawer ? (isRTL ? 'إغلاق القائمة' : 'Close menu') : (isRTL ? 'فتح القائمة' : 'Open menu');

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 24);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  useEffect(() => {
    const closeOnOutsideOrEscape = (event) => {
      if (event.key === 'Escape') {
        setDrawer(false);
        setDesktopOpen(false);
      }
      if (event.type === 'pointerdown' && desktopServicesRef.current && !desktopServicesRef.current.contains(event.target)) {
        setDesktopOpen(false);
      }
    };
    document.addEventListener('keydown', closeOnOutsideOrEscape);
    document.addEventListener('pointerdown', closeOnOutsideOrEscape);
    return () => {
      document.removeEventListener('keydown', closeOnOutsideOrEscape);
      document.removeEventListener('pointerdown', closeOnOutsideOrEscape);
    };
  }, []);

  useEffect(() => {
    setDrawer(false);
    setDesktopOpen(false);
    setMobileOpen(false);
  }, [path]);

  useEffect(() => {
    if (!drawer) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [drawer]);

  useEffect(() => {
    const submenu = mobileSubmenuRef.current;
    if (!drawer || !submenu) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = submenu.querySelectorAll('a');
    gsap.killTweensOf([submenu, items]);

    if (reducedMotion) {
      gsap.set(submenu, { height: mobileOpen ? 'auto' : 0, autoAlpha: mobileOpen ? 1 : 0 });
      gsap.set(items, { clearProps: 'transform,opacity' });
      return undefined;
    }

    if (mobileOpen) {
      gsap.set(submenu, { height: 0, autoAlpha: 0 });
      gsap.set(items, { autoAlpha: 0, y: 10 });
      const timeline = gsap.timeline();
      timeline
        .to(submenu, { height: 'auto', autoAlpha: 1, duration: 0.46, ease: 'power3.inOut' })
        .to(items, { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.045, ease: 'power3.out' }, '-=0.24');
      return () => timeline.kill();
    }

    const timeline = gsap.timeline();
    timeline.to(submenu, { height: 0, autoAlpha: 0, duration: 0.4, ease: 'power3.inOut' });
    return () => timeline.kill();
  }, [drawer, mobileOpen]);

  const closeDrawer = () => setDrawer(false);
  const desktopLink = ([name, href]) => (
    <Link key={href} className={`nav-link${path === base + href ? ' is-active' : ''}`} href={base + href}>
      {name}
    </Link>
  );

  return (
    <header className={`agency-nav ${scrolled ? 'is-scrolled' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mugran-grid-container agency-nav-inner">
        <Link href={base} className="agency-logo">
          <Image src={isRTL ? '/arlogo.svg' : '/H Logo.svg'} alt="Mugran" width={164} height={48} priority />
        </Link>

        <nav className="desktop-nav">
          {desktopLink(links[0])}
          <div
            className="services-nav"
            ref={desktopServicesRef}
            onMouseEnter={() => setDesktopOpen(true)}
            onMouseLeave={() => setDesktopOpen(false)}
          >
            <Link className={`nav-link${active || desktopOpen ? ' is-active' : ''}`} href={`${base}/services`}>
              {servicesLabel}
            </Link>
            <button className="services-toggle" aria-label="Services" aria-expanded={desktopOpen} onClick={() => setDesktopOpen((value) => !value)}>
              <img src="/icons/arrow-down-01.svg" alt="" />
            </button>
            {desktopOpen && (
              <div className="services-dropdown">
                {services.map(([name, description, href]) => (
                  <Link href={`${base}/services${href}`} key={href}><b>{name}</b><span>{description}</span></Link>
                ))}
                <Link className="all-services" href={`${base}/services`}>{isRTL ? 'عرض جميع الخدمات ↗' : 'VIEW ALL SERVICES ↗'}</Link>
              </div>
            )}
          </div>
          {links.slice(1).map(desktopLink)}
        </nav>

        <div className="nav-actions">
          <button className="language" onClick={toggleLang}>{lang === 'ar' ? 'EN' : 'ع'}</button>
          <button className="nav-project" onClick={openProjectModal}>{isRTL ? 'ابدأ مشروعك' : 'START A PROJECT'}</button>
          <button
            className="mobile-menu"
            type="button"
            aria-label={menuLabel}
            aria-expanded={drawer}
            aria-controls={mobileMenuId}
            onClick={() => setDrawer((value) => !value)}
          >
            <span className="mobile-menu-icon" aria-hidden="true">
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>

      {drawer && (
        <div id={mobileMenuId} className="agency-drawer">
          <Link className="drawer-link" href={base + links[0][1]} onClick={closeDrawer}>{links[0][0]}</Link>
          <div className="drawer-services-wrap">
            <button
              className={`drawer-services${mobileOpen || active ? ' is-active' : ''}`}
              aria-expanded={mobileOpen}
              aria-controls="mugran-mobile-services"
              onClick={() => setMobileOpen((value) => !value)}
            >
              <span>{servicesLabel}</span>
              <i aria-hidden="true"><span /><span /></i>
            </button>
            <div id="mugran-mobile-services" ref={mobileSubmenuRef} className="drawer-submenu" aria-hidden={!mobileOpen}>
              {services.map(([name, , href]) => (
                <Link tabIndex={mobileOpen ? 0 : -1} href={`${base}/services${href}`} onClick={closeDrawer} key={href}>{name}</Link>
              ))}
              <Link className="drawer-all-services" tabIndex={mobileOpen ? 0 : -1} href={`${base}/services`} onClick={closeDrawer}>
                {isRTL ? 'عرض جميع الخدمات ↗' : 'VIEW ALL SERVICES ↗'}
              </Link>
            </div>
          </div>
          {links.slice(1).map(([name, href]) => (
            <Link className="drawer-link" href={base + href} onClick={closeDrawer} key={href}>{name}</Link>
          ))}
          <div className="drawer-socials">
            {social.map(([name, href, ariaLabel]) => (
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} key={name}><SocialIcon name={name} /></a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
