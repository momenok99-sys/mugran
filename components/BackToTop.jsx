'use client';

import { useEffect, useState } from 'react';
import './BackToTop.css';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > Math.max(420, window.innerHeight * .7));
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  return <button type="button" className={`back-to-top ${visible ? 'is-visible' : ''}`} onClick={scrollTop} aria-label="Back to top"><span aria-hidden="true">↑</span></button>;
}
