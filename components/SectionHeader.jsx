'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SectionHeader({
  eyebrow = '',
  number = '',
  headline = '',
  lead = '',
  align = 'left',
  className = '',
  style = {},
}) {
  const { isRTL } = useLanguage();

  return (
    <div
      className={`section-header-root ${className}`}
      style={{
        marginBottom: '3rem',
        textAlign: align,
        maxWidth: align === 'center' ? '800px' : '900px',
        marginLeft: align === 'center' ? 'auto' : 0,
        marginRight: align === 'center' ? 'auto' : 0,
        ...style,
      }}
    >
      {/* Eyebrow / Number Badge */}
      {(eyebrow || number) && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '1rem',
          }}
        >
          {number && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-brand-blue)',
                padding: '2px 6px',
                borderRadius: '3px',
                backgroundColor: 'var(--color-brand-blue-subtle)',
              }}
            >
              {number}
            </span>
          )}
          {eyebrow && (
            <span
              className="mugran-tag"
              style={{
                fontSize: '0.78rem',
              }}
            >
              {eyebrow}
            </span>
          )}
        </div>
      )}

      {/* Main Headline */}
      {headline && (
        <h2
          style={{
            fontSize: 'clamp(2rem, 3.8vw, 3.4rem)',
            fontWeight: 800,
            color: 'var(--color-brand-ink)',
            lineHeight: isRTL ? 1.35 : 1.12,
            letterSpacing: isRTL ? 'normal' : '-0.025em',
            whiteSpace: 'pre-line',
            marginBottom: lead ? '1.25rem' : 0,
          }}
        >
          {headline}
        </h2>
      )}

      {/* Lead Subtext */}
      {lead && (
        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.3vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: isRTL ? 1.8 : 1.6,
            maxWidth: '65ch',
            margin: align === 'center' ? '0 auto' : '0',
          }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
