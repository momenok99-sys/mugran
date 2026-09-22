'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';
import './SiteIntro.css';

export default function SiteIntro() {
  const { isRTL } = useLanguage();
  const [show, setShow] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem('mugran-intro')) return undefined;
    sessionStorage.setItem('mugran-intro', '1');
    setShow(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setShow(false), reduced ? 180 : 2550);
    if (reduced) return () => window.clearTimeout(timer);

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();
      timeline
        .to('.site-intro-fragment', { x: 0, y: 0, rotate: 0, opacity: 1, duration: .62, stagger: .06, ease: 'power4.out' })
        .fromTo('.site-intro-logo', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .46, ease: 'power4.out' }, '-=.35')
        .to('.site-intro-line', { scaleX: 1, duration: .25, ease: 'power3.out' }, '-=.12')
        .from('.site-intro-copy', { y: 14, clipPath: 'inset(0 0 100% 0)', duration: .32, ease: 'power3.out' }, '-=.05')
        .to('.site-intro', { clipPath: 'inset(0 0 100% 0)', duration: .52, ease: 'power4.in' }, '+=.48');
    }, root);

    return () => { window.clearTimeout(timer); ctx.revert(); };
  }, []);

  if (!show) return null;
  return <div ref={root} className="site-intro" dir={isRTL ? 'rtl' : 'ltr'}><div><div className="site-intro-fragments" aria-hidden="true"><i className="site-intro-fragment"/><i className="site-intro-fragment"/><i className="site-intro-fragment"/></div><img className="site-intro-logo" src={isRTL ? '/arlogo.svg' : '/H Logo.svg'} alt="Mugran"/><i className="site-intro-line"/><p className="site-intro-copy">{isRTL ? 'نفكر قبل أن نصمــــــــم.' : 'WE THINK BEFORE WE MAKE.'}</p></div></div>;
}
