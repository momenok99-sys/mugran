'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    // Check if device has touch primary
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check for elements with data-cursor attribute
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorText(target.getAttribute('data-cursor') || '');
        setIsHovering(true);
      } else {
        const isInteractive = e.target.closest('a, button, input, textarea, select, [role="button"]');
        if (isInteractive) {
          setCursorText('');
          setIsHovering(true);
        } else {
          setCursorText('');
          setIsHovering(false);
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    let animationFrameId;
    const animateFollower = () => {
      // Smooth lerp
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animateFollower);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    animationFrameId = requestAnimationFrame(animateFollower);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Precision Dot */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          marginLeft: '-3px',
          marginTop: '-3px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-brand-blue)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isVisible && !cursorText ? 1 : 0,
          transition: 'opacity 0.2s ease',
          willChange: 'transform',
        }}
      />

      {/* Follower Ring / Label Badge */}
      <div
        ref={followerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: cursorText ? 'auto' : isHovering ? '44px' : '28px',
          height: cursorText ? '26px' : isHovering ? '44px' : '28px',
          marginLeft: cursorText ? '-32px' : isHovering ? '-22px' : '-14px',
          marginTop: cursorText ? '-13px' : isHovering ? '-22px' : '-14px',
          borderRadius: cursorText ? '13px' : '50%',
          border: cursorText ? 'none' : '1.5px solid rgba(42, 74, 159, 0.4)',
          backgroundColor: cursorText ? 'var(--color-brand-ink)' : isHovering ? 'rgba(42, 74, 159, 0.08)' : 'transparent',
          color: '#FFFFFF',
          padding: cursorText ? '0 12px' : '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border 0.2s ease, opacity 0.2s ease',
          willChange: 'transform',
        }}
      >
        {cursorText}
      </div>
    </>
  );
}
