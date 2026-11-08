'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from './motionRuntime';

// Interpolate the existing editorial heights rather than flattening the gallery
// into a marquee. The wrap's second visual instance bridges each clipped edge.
function curve(points, x) {
  if (x <= points[0].x) return points[0].y;
  for (let i = 1; i < points.length; i++) {
    if (x <= points[i].x) {
      const previous = points[i - 1];
      const fraction = (x - previous.x) / (points[i].x - previous.x);
      return previous.y + (points[i].y - previous.y) * fraction;
    }
  }
  return points[points.length - 1].y;
}

export default function useCampaignMotion(reference) {
  const phase = useRef(0);
  const arrived = useRef(false);
  useEffect(() => {
    let disposed = false;
    let context;
    let media;
    document.fonts.ready.then(() => {
      if (disposed || !reference.current) return;
      const gallery = reference.current;
      context = gsap.context(() => {
        media = gsap.matchMedia();
        media.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)', hover: '(hover: hover) and (pointer: fine)', reduce: '(prefers-reduced-motion: reduce)' }, ({ conditions }) => {
          const viewport = gallery.querySelector('.lf-campaign-window');
          const source = gallery.querySelector('.lf-campaign-source');
          const originals = [...gallery.querySelectorAll('.lf-campaign-visual')];
          const copies = [...gallery.querySelectorAll('.lf-campaign-copy')];
          const slots = [...originals, ...copies];
          if (conditions.reduce) {
            gallery.dataset.campaignState = 'reduced';
            copies.forEach(copy => { copy.hidden = true; });
            return;
          }

          const listeners = [];
          const listen = (element, event, handler) => {
            element.addEventListener(event, handler);
            listeners.push(() => element.removeEventListener(event, handler));
          };
          let rows = [];
          let inView = false;
          let hovered = false;
          let focused = false;
          let userPaused = false;
          let introduced = arrived.current;
          let gate;
          let width = 0;
          let height = 0;
          let ramp;
          let loop;
          const clock = { value: phase.current };
          const setters = slots.map(slot => ({
            x: gsap.quickSetter(slot.querySelector('.lf-campaign-loop'), 'x', 'px'),
            y: gsap.quickSetter(slot.querySelector('.lf-campaign-loop'), 'y', 'px'),
          }));

          function paint() {
            const progress = gsap.utils.wrap(0, 1, clock.value);
            phase.current = progress;
            for (const row of rows) {
              for (const item of row.items) {
                const x = gsap.utils.wrap(-item.width, row.period - item.width, item.x - progress * row.period);
                setters[item.index].x(x - item.x);
                setters[item.index].y(curve(row.points, x) - item.y);
                setters[item.index + 5].x(x + row.period - item.x);
                setters[item.index + 5].y(curve(row.points, x + row.period) - item.y);
              }
            }
          }

          function measure() {
            const groups = conditions.mobile ? [[0, 1, 2], [3, 4]] : [[0, 1, 2, 3, 4]];
            const viewportBounds = viewport.getBoundingClientRect();
            rows = groups.map(indices => {
              const items = indices.map(index => {
                const slot = originals[index];
                const bounds = slot.getBoundingClientRect();
                return { index, x: bounds.left - viewportBounds.left, y: bounds.top - viewportBounds.top, width: bounds.width, height: bounds.height };
              });
              const pitch = (items[items.length - 1].x - items[0].x) / (items.length - 1);
              const period = pitch * items.length;
              const visibleWidth = Math.min(viewport.clientWidth, items[items.length - 1].x + items[items.length - 1].width);
              items.forEach(item => {
                const original = originals[item.index];
                const copy = copies[item.index];
                Object.assign(copy.style, { left: `${item.x}px`, top: `${item.y}px`, width: `${item.width}px`, height: `${item.height}px` });
                // Preserve the empty third column of the original lower mobile
                // row. Both copies share exactly the same world-space window.
                const clip = `inset(-100vh ${item.x + item.width - visibleWidth}px -100vh ${-item.x}px)`;
                original.style.clipPath = clip;
                copy.style.clipPath = clip;
              });
              return { items, period, points: items.map(item => ({ x: item.x, y: item.y })) };
            });
            width = viewport.clientWidth;
            height = viewport.clientHeight;
            paint();
          }

          function synchronize(immediate = false) {
            const running = introduced && inView && !hovered && !focused && !userPaused && !document.hidden;
            gallery.dataset.campaignState = !introduced ? 'arriving' : running ? 'running' : 'paused';
            ramp?.kill();
            if (!loop) return;
            if (immediate || document.hidden || !inView) {
              loop.timeScale(running ? 1 : 0).paused(!running);
              return;
            }
            if (running) loop.play();
            ramp = gsap.to(loop, { timeScale: running ? 1 : 0, duration: running ? .6 : .4, ease: 'power2.out', overwrite: true,
              onComplete: () => { if (!running) loop.pause(); } });
          }

          copies.forEach(copy => { copy.hidden = false; });
          measure();
          loop = gsap.to(clock, { value: clock.value + 1, duration: 26, repeat: -1, ease: 'none', paused: true,
            onUpdate: paint, onRepeat: () => { gallery.dataset.loopCycles = String(Number(gallery.dataset.loopCycles || 0) + 1); } });
          const intros = slots.map(slot => slot.querySelector('.lf-campaign-intro'));
          const introduction = gsap.timeline({ paused: true, onComplete: () => {
            introduced = true;
            arrived.current = true;
            synchronize();
          } });
          if (introduced) {
            gsap.set(intros, { clearProps: 'opacity,transform' });
          } else {
            gsap.set(intros, { opacity: 0, y: conditions.mobile ? 12 : 20 });
            // Originals and their wrap copies arrive at the same point in time.
            originals.forEach((slot, index) => {
              introduction.to([intros[index], intros[index + 5]], { opacity: 1, y: 0, duration: .75, ease: 'power3.out', clearProps: 'opacity,transform' }, index * .1);
            });
          }

          const arrival = gsap.timeline({
            onComplete: () => { if (!introduced) introduction.play(); },
            scrollTrigger: { id: 'launch-campaign-arrival', trigger: gallery.closest('.lf-campaign-showcase'), start: 'top 45%', end: 'top 8%', scrub: .45, invalidateOnRefresh: true },
          });
          arrival.fromTo(source, { y: conditions.mobile ? -120 : -160, opacity: .15 }, { y: 0, opacity: 1, duration: 1, ease: 'none' });
          gate = ScrollTrigger.create({ id: 'launch-campaign-loop-gate', trigger: viewport, start: 'top bottom', end: 'bottom top',
            onToggle: self => { inView = self.isActive; synchronize(true); } });
          inView = gate.isActive;
          synchronize(true);

          if (conditions.hover) {
            listen(viewport, 'pointerenter', () => { hovered = true; synchronize(); });
            listen(viewport, 'pointerleave', () => { hovered = false; synchronize(); });
            for (const slot of slots) {
              const mask = slot.querySelector('.lf-campaign-mask');
              const image = mask.querySelector('img');
              listen(slot, 'pointerenter', () => {
                gsap.to(mask, { y: -5, duration: .35, ease: 'power3.out', overwrite: true });
                gsap.to(image, { scale: 1.035, duration: .5, ease: 'power3.out', overwrite: true });
              });
              listen(slot, 'pointerleave', () => {
                gsap.to(mask, { y: 0, duration: .4, ease: 'power3.out', overwrite: true, clearProps: 'transform' });
                gsap.to(image, { scale: 1, duration: .5, ease: 'power3.out', overwrite: true, clearProps: 'transform' });
              });
            }
          }
          listen(viewport, 'focusin', () => { focused = true; synchronize(); });
          listen(viewport, 'focusout', event => { if (!viewport.contains(event.relatedTarget)) { focused = false; synchronize(); } });
          listen(viewport, 'keydown', event => {
            if (event.code !== 'Space') return;
            event.preventDefault();
            userPaused = !userPaused;
            focused = false;
            synchronize();
          });
          listen(document, 'visibilitychange', () => synchronize(true));
          const observer = new ResizeObserver(() => {
            if (viewport.clientWidth !== width || viewport.clientHeight !== height) measure();
          });
          observer.observe(viewport);

          return () => {
            observer.disconnect();
            listeners.forEach(remove => remove());
            ramp?.kill();
            loop.kill();
            introduction.kill();
            // Hover callbacks run outside the setup context and own these tweens.
            const masks = slots.map(slot => slot.querySelector('.lf-campaign-mask'));
            const images = masks.map(mask => mask.querySelector('img'));
            gsap.killTweensOf([...masks, ...images]);
            gsap.set([...masks, ...images], { clearProps: 'transform' });
            gsap.set(slots.map(slot => slot.querySelector('.lf-campaign-loop')), { clearProps: 'transform' });
            slots.forEach(slot => slot.style.removeProperty('clip-path'));
            copies.forEach(copy => { copy.hidden = true; copy.removeAttribute('style'); });
            gallery.dataset.campaignState = 'static';
          };
        }, gallery);
      }, gallery);
    });
    return () => {
      disposed = true;
      media?.revert();
      context?.revert();
    };
  }, [reference]);
}
