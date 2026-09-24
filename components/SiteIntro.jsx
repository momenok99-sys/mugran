'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';
import './SiteIntro.css';

const words = ['WE', 'THINK', 'BEFORE', 'WE', 'MAKE.'];

export default function SiteIntro() {
  const { isRTL } = useLanguage();
  const [visible, setVisible] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem('mugran-intro')) return;
    sessionStorage.setItem('mugran-intro', '1');
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible || !root.current) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const clear = window.setTimeout(() => setVisible(false), 220);
      return () => window.clearTimeout(clear);
    }

    const ctx = gsap.context(() => {
      const statement = '.site-intro-statement';
      const wordNodes = gsap.utils.toArray('.site-intro-word');
      const blue = '.site-intro-blue';
      const logo = '.site-intro-logo';
      const intro = '.site-intro';
      const website = document.querySelector('main');
      const tl = gsap.timeline({ defaults: { overwrite: 'auto' }, onComplete: () => setVisible(false) });

      tl.set(blue, { yPercent: 100 })
        .set(logo, { autoAlpha: 0, y: 24, filter: 'blur(6px)' })
        .set(statement, { autoAlpha: 1 })
        .fromTo(wordNodes, { autoAlpha: 0, y: 24, filter: 'blur(7px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .66, stagger: .055, ease: 'power4.out' })
        .to({}, { duration: 1.72 })
        .to(statement, { autoAlpha: 0, y: -16, filter: 'blur(5px)', duration: .28, ease: 'power2.in' })
        .fromTo(blue, { yPercent: 100 }, { yPercent: 0, duration: .8, ease: 'power4.inOut' })
        .to({}, { duration: .15 })
        .to(logo, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: .66, ease: 'power4.out' })
        .to({}, { duration: .51 });
      if (website) {
        tl.fromTo(website, { opacity: .75, y: 14 }, { opacity: 1, y: 0, duration: .98, ease: 'power3.out' }, '+=0')
          .to(intro, { yPercent: -100, duration: .98, ease: 'power4.inOut' }, '<')
          .set(website, { clearProps: 'transform,opacity' });
      } else {
        tl.to(intro, { yPercent: -100, duration: .98, ease: 'power4.inOut' });
      }
    }, root);
    return () => ctx.revert();
  }, [visible]);

  if (!visible) return null;
  return <div ref={root} className="site-intro" aria-label="Mugran intro">
    <div className="site-intro-statement-layer"><p className="site-intro-statement">{words.map((word, index) => <span className="site-intro-word" key={`${word}-${index}`}>{word}</span>)}</p></div>
    <div className="site-intro-blue"><div className="site-intro-logo-mask"><img className="site-intro-logo" src={isRTL ? '/arlogo.svg' : '/whitelogo.svg'} alt="Mugran" /></div></div>
  </div>;
}
