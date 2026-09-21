'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SectionHeading({
  tag,
  title,
  subtitle,
  align = 'left',
  amberTag = false,
  className = '',
  style = {},
}) {
  const { isRTL } = useLanguage();

  const alignment = align === 'center' ? 'center' : isRTL ? 'right' : 'left';

  return (
    <div
      className={`reveal-up ${className}`}
      style={{
        textAlign: alignment,
        marginBottom: '3.5rem',
        maxWidth: align === 'center' ? '820px' : '900px',
        marginLeft: align === 'center' ? 'auto' : 0,
        marginRight: align === 'center' ? 'auto' : 0,
        ...style,
      }}
    >
      {tag && (
        <div style={{ marginBottom: '1rem' }}>
          <span className={`mugran-tag ${amberTag ? 'mugran-tag-amber' : ''}`}>
            [ <span>{tag}</span> ]
          </span>
        </div>
      )}

      {title && (
        <h2
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: isRTL ? 1.35 : 1.08,
            letterSpacing: isRTL ? 'normal' : '-0.035em',
            color: 'var(--color-brand-ink)',
            whiteSpace: 'pre-line',
            marginBottom: subtitle ? '1.25rem' : '0',
          }}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.3vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: isRTL ? 1.85 : 1.65,
            maxWidth: '720px',
            marginLeft: align === 'center' ? 'auto' : 0,
            marginRight: align === 'center' ? 'auto' : 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
