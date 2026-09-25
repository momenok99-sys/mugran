'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './HeroFilm.css';

export default function HeroFilm({ src, poster, isRTL }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const cardRef = useRef(null);
  const cursorRef = useRef(null);
  const triggerRef = useRef(null);
  const videoRef = useRef(null);
  const closeRef = useRef(null);
  const closeTimer = useRef(null);

  const openViewer = () => setOpen(true);
  const closeViewer = () => {
    if (closing) return;
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      triggerRef.current?.focus();
    }, 360);
  };

  useEffect(() => {
    const card = cardRef.current;
    const cursor = cursorRef.current;
    if (!card || !cursor || !window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const x = gsap.quickTo(cursor, 'x', { duration: .28, ease: 'power3.out' });
    const y = gsap.quickTo(cursor, 'y', { duration: .28, ease: 'power3.out' });
    const move = (event) => { const box = card.getBoundingClientRect(); x(event.clientX - box.left - 44); y(event.clientY - box.top - 44); };
    const enter = () => gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: .3, ease: 'power3.out' });
    const leave = () => gsap.to(cursor, { autoAlpha: 0, scale: .75, duration: .2, ease: 'power3.out' });
    card.addEventListener('pointermove', move); card.addEventListener('pointerenter', enter); card.addEventListener('pointerleave', leave);
    return () => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave); };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    videoRef.current?.play().catch(() => {});
    const onKeyDown = (event) => event.key === 'Escape' && closeViewer();
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown); window.clearTimeout(closeTimer.current); };
  }, [open]);

  const label = isRTL ? 'تشغيل فيلم مُقرن' : 'Play Mugran brand film';
  return <>
    <button ref={triggerRef} type="button" className="ms-hero-film-trigger" aria-label={label} onClick={openViewer}>
      <span ref={cardRef} className="ms-hero-film-card"><video autoPlay muted loop playsInline preload="metadata" poster={poster}><source src={src} type="video/mp4" /></video><span ref={cursorRef} className="ms-hero-film-play"><span className="ms-play-icon" /></span><span className="ms-hero-film-mobile-play"><span className="ms-play-icon" /></span></span>
    </button>
    {open && <div className={`film-viewer${closing ? ' is-closing' : ''}`} role="dialog" aria-modal="true" aria-label={label} onMouseDown={(event) => event.target === event.currentTarget && closeViewer()}><button ref={closeRef} type="button" className="film-viewer-close" aria-label={isRTL ? 'إغلاق الفيلم' : 'Close film'} onClick={closeViewer}>×</button><div className="film-viewer-frame"><video ref={videoRef} controls loop playsInline preload="metadata"><source src={src} type="video/mp4" /></video></div></div>}
  </>;
}
