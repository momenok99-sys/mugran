'use client';

import { useRef, useState } from 'react';

export default function BeforeAfterSlider({ before, after }) {
  const [position, setPosition] = useState(50);
  const pointer = useRef(null);
  const update = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)));
  };
  const finish = (event) => {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <div className="lf-comparison-frame" role="slider" tabIndex={0}
    aria-label="Compare original and art directed product images" aria-orientation="horizontal"
    aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)}
    aria-valuetext={`${Math.round(position)}% Original, ${Math.round(100 - position)}% Art Directed`}
    style={{ '--reveal': `${position}%` }}
    onPointerDown={event => {
      if (!event.isPrimary || event.button !== 0 || pointer.current !== null) return;
      pointer.current = event.pointerId;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.focus({ preventScroll: true });
      update(event);
    }}
    onPointerMove={event => { if (pointer.current === event.pointerId) update(event); }}
    onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={() => { pointer.current = null; }}
    onKeyDown={event => {
      const delta = event.shiftKey ? 10 : 1;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      setPosition(value => event.key === 'Home' ? 0 : event.key === 'End' ? 100 : Math.max(0, Math.min(100, value + (event.key === 'ArrowLeft' ? -delta : delta))));
    }}>
    <div className="lf-comparison-layer"><img src={after} alt="Art directed Sauvage product photograph by the sea" width="1696" height="2528" draggable={false} loading="lazy" /><span className="lf-comparison-label lf-comparison-after">Art Directed</span></div>
    <div className="lf-comparison-layer lf-comparison-before"><img src={before} alt="Original Sauvage product photograph on a light background" width="735" height="795" draggable={false} loading="lazy" /><span className="lf-comparison-label">Original</span></div>
    <span className="lf-comparison-divider" aria-hidden="true"><span className="lf-comparison-handle"><svg width="24" height="16" viewBox="0 0 24 16" fill="none"><path d="m8 3-5 5 5 5m8-10 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></span>
  </div>;
}
