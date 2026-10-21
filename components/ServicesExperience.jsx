'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { serviceImages, servicesCopy } from './servicesData';
import './ServicesExperience.css';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

function RevealTitle({ children, className = '', as: Tag = 'h2' }) {
  return (
    <Tag className={`sx-reveal ${className}`.trim()}>
      {children.split(' ').map((word, index) => (
        <span className="sx-word" key={`${word}-${index}`}><span>{word}</span></span>
      ))}
    </Tag>
  );
}

function FigmaServicesHero({ copy, isRTL }) {
  return (
    <section className="sx-figma-hero" aria-labelledby="services-figma-title">
      <Image className="sx-figma-hero-art" src="/images/services/figma-better-together.png" alt="" fill priority sizes="100vw" aria-hidden="true" />
      <div className="sx-figma-hero-copy">
        <h1 id="services-figma-title">{isRTL ? copy.titleDisplay : copy.title}</h1>
        <p>{copy.body}</p>
      </div>
    </section>
  );
}

function Media({ src, alt, sizes, priority = false, className = '' }) {
  return (
    <div className={`sx-media ${className}`.trim()}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
    </div>
  );
}

export default function ServicesExperience() {
  const root = useRef(null);
  const connectedVideo = useRef(null);
  const { lang = 'en', isRTL, openProjectModal } = useLanguage();
  const t = servicesCopy[lang] || servicesCopy.en;

  useEffect(() => {
    const context = gsap.context(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
      intro
        .from('.sx-hero-title .sx-word > span', { yPercent: 112, duration: 1.05, stagger: 0.055 })
        .from('.sx-hero-copy', { y: 28, autoAlpha: 0, duration: 0.7 }, '-=0.55');

      gsap.utils.toArray('.sx-reveal:not(.sx-hero-title)').forEach((heading) => {
        gsap.from(heading.querySelectorAll('.sx-word > span'), {
          yPercent: 108,
          duration: 0.85,
          stagger: 0.035,
          ease: 'power4.out',
          scrollTrigger: { trigger: heading, start: 'top 84%', once: true },
        });
      });

      gsap.utils.toArray('.sx-mask').forEach((mask) => {
        gsap.from(mask, {
          clipPath: isRTL ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
          duration: 1.15,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: mask, start: 'top 82%', once: true },
        });
      });

      gsap.utils.toArray('.sx-parallax img').forEach((image) => {
        gsap.fromTo(image, { yPercent: -7, scale: 1.06 }, {
          yPercent: 7,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        });
      });

      const media = gsap.matchMedia();
      media.add('(min-width: 961px)', () => {
        const webTimeline = gsap.timeline({
          scrollTrigger: { trigger: '.sx-web', start: 'top top', end: '+=115%', pin: '.sx-web-stage', scrub: 0.75, anticipatePin: 1 },
        });
        webTimeline
          .fromTo('.sx-web-main', { scale: 0.91 }, { scale: 1, ease: 'none' }, 0)
          .fromTo('.sx-web-detail', { yPercent: 35, rotate: 2 }, { yPercent: -10, rotate: -1, ease: 'none' }, 0)
          .fromTo('.sx-web-copy', { y: 80, opacity: 0.45 }, { y: 0, opacity: 1, ease: 'none' }, 0.15);

      });

      return () => media.revert();
    }, root);

    return () => context.revert();
  }, [lang, isRTL]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const video = connectedVideo.current;
    if (!video) return undefined;

    const updatePlayback = () => {
      if (mediaQuery.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        video.play().catch(() => {});
      }
    };

    updatePlayback();
    mediaQuery.addEventListener?.('change', updatePlayback);
    return () => mediaQuery.removeEventListener?.('change', updatePlayback);
  }, []);

  return (
    <div ref={root} className="sx" dir={isRTL ? 'rtl' : 'ltr'}>
      <FigmaServicesHero copy={t.figmaHero} isRTL={isRTL} />

      <header className="sx-hero">
        <div className="sx-shell">
          <RevealTitle as="h2" className="sx-hero-title">{isRTL ? t.hero.titleDisplay : t.hero.title}</RevealTitle>
          <p className="sx-hero-copy">{t.hero.body}</p>
        </div>
      </header>

      <main>
        <section className="sx-service sx-brand" id="brand">
          <div className="sx-shell">
            <div className="sx-service-copy">
              <p className="sx-service-name">{t.services[0].name}</p>
              <RevealTitle>{isRTL ? t.services[0].titleDisplay : t.services[0].title}</RevealTitle>
              <p className="sx-description">{t.services[0].body}</p>
              <p className="sx-capabilities">{t.services[0].capabilities.join(' · ')}</p>
              <Link href={t.services[0].href} className="sx-text-link">{t.services[0].link}<span aria-hidden="true">↗</span></Link>
            </div>
            <div className="sx-brand-art">
              <Media className="sx-mask sx-parallax sx-brand-main" src={serviceImages.brand[0]} alt={t.services[0].imageAlts[0]} sizes="(max-width: 960px) 92vw, 63vw" priority />
              <Media className="sx-mask sx-parallax sx-brand-detail" src={serviceImages.brand[1]} alt={t.services[0].imageAlts[1]} sizes="(max-width: 640px) 44vw, 24vw" />
            </div>
          </div>
        </section>

        <section className="sx-service sx-web" id="web">
          <div className="sx-shell sx-web-layout">
            <div className="sx-web-copy sx-service-copy">
              <p className="sx-service-name">{t.services[1].name}</p>
              <RevealTitle>{isRTL ? t.services[1].titleDisplay : t.services[1].title}</RevealTitle>
              <p className="sx-description">{t.services[1].body}</p>
              <p className="sx-capabilities">{t.services[1].capabilities.join(' · ')}</p>
              <Link href={t.services[1].href} className="sx-text-link">{t.services[1].link}<span aria-hidden="true">↗</span></Link>
            </div>
            <div className="sx-web-stage">
              <Media className="sx-mask sx-web-main" src={serviceImages.web[0]} alt={t.services[1].imageAlts[0]} sizes="(max-width: 960px) 92vw, 58vw" />
              <Media className="sx-web-detail" src={serviceImages.web[1]} alt={t.services[1].imageAlts[1]} sizes="(max-width: 640px) 42vw, 21vw" />
            </div>
          </div>
        </section>

        <section className="sx-service sx-creative" id="creative">
          <div className="sx-shell">
            <div className="sx-creative-art">
              <Media className="sx-mask sx-parallax sx-creative-main" src={serviceImages.creative[0]} alt={t.services[2].imageAlts[0]} sizes="(max-width: 960px) 92vw, 68vw" />
              <Media className="sx-mask sx-parallax sx-creative-detail" src={serviceImages.creative[1]} alt={t.services[2].imageAlts[1]} sizes="(max-width: 640px) 48vw, 25vw" />
            </div>
            <div className="sx-service-copy sx-creative-copy">
              <p className="sx-service-name">{t.services[2].name}</p>
              <RevealTitle>{isRTL ? t.services[2].titleDisplay : t.services[2].title}</RevealTitle>
              <p className="sx-description">{t.services[2].body}</p>
              <p className="sx-capabilities">{t.services[2].capabilities.join(' · ')}</p>
              <Link href={t.services[2].href} className="sx-text-link">{t.services[2].link}<span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <section className="sx-connected" id="connected">
          <video
            ref={connectedVideo}
            className="sx-connected-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src="/bbg.mp4" type="video/mp4" />
          </video>
          <div className="sx-connected-copy">
            <h2>{isRTL ? t.connected.titleDisplay : t.connected.title}</h2>
            <p>{t.connected.body}</p>
          </div>
        </section>

        <section className="sx-cta">
          <div className="sx-shell">
            <RevealTitle>{isRTL ? t.cta.titleDisplay : t.cta.title}</RevealTitle>
            <div className="sx-cta-bottom">
              <p>{t.cta.body}</p>
              <button type="button" onClick={() => openProjectModal()}>{t.cta.button}<span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
