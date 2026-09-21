'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'amber'
  icon = '↗',
  className = '',
  style = {},
}) {
  const { isRTL } = useLanguage();

  const getLocalizedHref = (targetHref) => {
    if (!targetHref) return null;
    if (targetHref.startsWith('http') || targetHref.startsWith('mailto')) return targetHref;
    if (isRTL) {
      if (targetHref === '/') return '/ar';
      return targetHref.startsWith('/ar') ? targetHref : `/ar${targetHref}`;
    } else {
      return targetHref.replace(/^\/ar/, '') || '/';
    }
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: isRTL ? '0.75rem 1.6rem 0.75rem 0.85rem' : '0.75rem 0.85rem 0.75rem 1.6rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: 700,
    letterSpacing: isRTL ? 'normal' : '0.08em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    fontFamily: isRTL ? 'var(--font-arabic)' : 'var(--font-sans)',
    ...style,
  };

  const getVariantStyles = () => {
    if (variant === 'amber') {
      return {
        backgroundColor: 'var(--color-accent-amber)',
        color: '#FFFFFF',
        border: '1px solid var(--color-accent-amber)',
      };
    }
    if (variant === 'secondary') {
      return {
        backgroundColor: '#FFFFFF',
        color: 'var(--color-brand-ink)',
        border: '1px solid var(--border-subtle)',
      };
    }
    // primary default
    return {
      backgroundColor: 'var(--color-brand-ink)',
      color: '#FFFFFF',
      border: '1px solid var(--color-brand-ink)',
    };
  };

  const combinedStyles = { ...buttonStyle, ...getVariantStyles() };

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <span
          className="btn-icon-circle"
          style={{
            transform: isRTL && icon === '↗' ? 'scaleX(-1)' : 'none',
          }}
        >
          {icon}
        </span>
      )}
    </>
  );

  if (href) {
    const locHref = getLocalizedHref(href);
    const isExt = href.startsWith('http') || href.startsWith('mailto');
    if (isExt) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-magnetic ${className}`}
          style={combinedStyles}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={locHref} className={`btn-magnetic ${className}`} style={combinedStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`btn-magnetic ${className}`} style={combinedStyles}>
      {content}
    </button>
  );
}
