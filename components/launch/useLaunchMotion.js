'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from './motionRuntime';

export default function useLaunchMotion(root) {
  useEffect(() => {
    let disposed = false;
    let context;
    let media;
    let frame;
    let introFrame;
    let introObserver;
    let introTimeout;
    let finishIntro;
    const imageCleanups = [];

    // Geometry is never measured against a temporary fallback font.
    const introReady = new Promise(resolve => {
      finishIntro = () => { introObserver?.disconnect(); clearTimeout(introTimeout); resolve(); };
      introFrame = requestAnimationFrame(() => {
        if (!document.querySelector('.site-intro')) { finishIntro(); return; }
        introObserver = new MutationObserver(() => { if (!document.querySelector('.site-intro')) finishIntro(); });
        introObserver.observe(document.body, { childList: true, subtree: true });
        introTimeout = setTimeout(finishIntro, 8000);
      });
    });
    Promise.all([document.fonts.ready, introReady]).then(() => {
      if (disposed || !root.current) return;
      context = gsap.context(() => {
        media = gsap.matchMedia();
        media.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)', hover: '(hover: hover) and (pointer: fine)', reduce: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
          if (conditions.reduce) return;
          const distance = conditions.mobile ? 12 : 22;
          const find = (selector) => root.current.querySelectorAll(selector);
          const reveal = (amount = distance) => ({ opacity: 0, y: amount, duration: .8, ease: 'power3.out', clearProps: 'opacity,transform' });
          function timeline(name) {
            const trigger = root.current.querySelector(`[data-motion="${name}"]`);
            return gsap.timeline({ scrollTrigger: { id: `launch-${name}`, trigger, start: 'top 84%', toggleActions: 'play none none none' } });
          }
          // Every target is visible in CSS; GSAP only hides it after initialization.
          timeline('hero')
            .from(find('.lf-hero-heading'), reveal(18), 0)
            .from(find('.lf-hero-description > p'), reveal(12), .14)
            .from(find('.lf-hero-actions'), reveal(10), .26)
            .from(find('.lf-hero-image'), { clipPath: 'inset(0 0 100% 0 round 8%)', duration: 1.1, clearProps: 'clipPath' }, .16);

          timeline('statement')
            .from(find('.lf-statement h2'), reveal(), 0)
            .from(find('.lf-statement-product'), { opacity: 0, x: -12, duration: .9, stagger: .08, clearProps: 'opacity,transform' }, .14)
            .from(find('.lf-statement-copy'), { opacity: 0, duration: .8, clearProps: 'opacity' }, .28);

          timeline('landing-showcase')
            .from(find('.lf-landing-showcase .lf-text-line'), { ...reveal(), stagger: .1 }, 0)
            .from(find('.lf-landing-showcase header p'), { opacity: 0, duration: .7, clearProps: 'opacity' }, .16)
            .from(find('.lf-laptop-position'), reveal(14), .24);

          for (const [name, selector] of [['landing-pricing', '.lf-pricing:not(.lf-campaign-pricing)'], ['campaign-pricing', '.lf-campaign-pricing']]) {
            timeline(name)
              .from(find(`${selector} .lf-pricing-background`), { opacity: 0, duration: .9, clearProps: 'opacity' }, 0)
              .from(find(`${selector} .lf-price-panel`), { opacity: 0, duration: .8, clearProps: 'opacity' }, .1)
              .from(find(`${selector} .lf-price-note`), reveal(8), .18)
              .from(find(`${selector} .lf-price`), reveal(6), .26)
              .from(find(`${selector} .lf-deliverables li`), { opacity: 0, duration: .6, stagger: .07, clearProps: 'opacity' }, .32)
              .from(find(`${selector} .lf-button`), reveal(8), .52);
          }

          // The source, campaign introduction, loop and card hover have their own
          // scoped hook and independent transform layers.
          timeline('campaign-showcase').from(find('.lf-campaign-showcase header'), reveal(), 0);

          timeline('work').from(find('.lf-work header'), reveal(14), 0);
          root.current.querySelectorAll('.lf-work-grid .lf-art').forEach((image, index) => {
            gsap.from(image, { opacity: 0, clipPath: 'inset(0 0 10% 0)', duration: .85, delay: index * .06, clearProps: 'opacity,clipPath', scrollTrigger: { id: `launch-work-${index}`, trigger: image, start: 'top 88%' } });
          });

          timeline('kit')
            .from(find('.lf-kit h2'), reveal(), 0)
            .from(find('.lf-kit-copy > p'), { opacity: 0, duration: .7, clearProps: 'opacity' }, .12)
            .from(find('.lf-kit-campaign'), { opacity: 0, duration: .8, stagger: .09, clearProps: 'opacity' }, .16)
            .from(find('.lf-kit-laptop'), reveal(14), .3)
            .from(find('.lf-kit-commercial'), reveal(6), .52)
            .from(find('.lf-kit .lf-button'), reveal(8), .64);

          timeline('faq')
            .from(find('.lf-faq h2'), { opacity: 0, duration: .8, clearProps: 'opacity' }, 0)
            .from(find('.lf-faq-row'), { ...reveal(8), stagger: .1 }, .1);
          timeline('final')
            .from(find('.lf-final h2'), reveal(16), 0)
            .from(find('.lf-final-content > p'), { opacity: 0, duration: .8, clearProps: 'opacity' }, .18)
            .from(find('.lf-final .lf-button'), reveal(10), .32);

          const cleanupHover = [];
          if (conditions.hover) {
            function depth(areaSelector, layerSelector, limit) {
              const area = root.current.querySelector(areaSelector);
              const layer = area.querySelector(layerSelector);
              const x = gsap.quickTo(layer, 'rotationX', { duration: .6, ease: 'power3.out' });
              const y = gsap.quickTo(layer, 'rotationY', { duration: .6, ease: 'power3.out' });
              const move = event => {
                const bounds = area.getBoundingClientRect();
                x(gsap.utils.clamp(-limit, limit, (0.5 - (event.clientY - bounds.top) / bounds.height) * limit * 2));
                y(gsap.utils.clamp(-limit, limit, ((event.clientX - bounds.left) / bounds.width - 0.5) * limit * 2));
              };
              const leave = () => { x(0); y(0); };
              area.addEventListener('pointermove', move);
              area.addEventListener('pointerleave', leave);
              cleanupHover.push(() => { area.removeEventListener('pointermove', move); area.removeEventListener('pointerleave', leave); });
            }
            depth('.lf-laptop-position', '.lf-laptop-depth', 1.4);
            depth('.lf-kit-art', '.lf-kit-depth', 1);
            root.current.querySelectorAll('.lf-work-grid .lf-art').forEach(mask => {
              const image = mask.querySelector('img');
              const enter = () => gsap.to(image, { scale: 1.025, duration: .5, ease: 'power3.out', overwrite: true });
              const leave = () => gsap.to(image, { scale: 1, duration: .5, ease: 'power3.out', overwrite: true, clearProps: 'transform' });
              mask.addEventListener('pointerenter', enter);
              mask.addEventListener('pointerleave', leave);
              cleanupHover.push(() => {
                mask.removeEventListener('pointerenter', enter);
                mask.removeEventListener('pointerleave', leave);
                gsap.killTweensOf(image);
                gsap.set(image, { clearProps: 'transform' });
              });
            });
          }
          return () => cleanupHover.forEach(cleanup => cleanup());
        }, root.current);
      }, root.current);

      // Lazy image loads are coalesced into one refresh per animation frame.
      const refresh = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
      };
      root.current.querySelectorAll('img').forEach(image => {
        if (image.complete) return;
        image.addEventListener('load', refresh, { once: true });
        imageCleanups.push(() => image.removeEventListener('load', refresh));
      });
      refresh();
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(introFrame);
      finishIntro?.();
      imageCleanups.forEach(cleanup => cleanup());
      media?.revert();
      context?.revert();
    };
  }, [root]);
}
