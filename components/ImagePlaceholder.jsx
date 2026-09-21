'use client';

import React from 'react';

export default function ImagePlaceholder({
  aspectRatio = '16:9',
  label = 'Mugran System Asset',
  category = '',
  className = '',
  style = {},
  onClick = null,
  cursorTag = 'VIEW',
}) {
  const aspectMap = {
    '16:9': '56.25%',
    '4:3': '75%',
    '1:1': '100%',
    '3:2': '66.67%',
    '21:9': '42.85%',
    'video': '56.25%',
  };

  const paddingBottom = aspectMap[aspectRatio] || '56.25%';

  return (
    <div
      className={`image-placeholder-root ${className}`}
      onClick={onClick}
      data-cursor={cursorTag}
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: paddingBottom,
        backgroundColor: '#EBEBE6',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {/* Background Blueprint Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(11, 19, 56, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(11, 19, 56, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          opacity: 0.8,
        }}
      />

      {/* Center Architectural Mark */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid rgba(11, 19, 56, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-ink)" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-secondary)',
          }}
        >
          {label}
        </span>
      </div>

      {/* Top Left Tag */}
      {category && (
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-brand-ink)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            border: '1px solid rgba(226, 226, 220, 0.8)',
          }}
        >
          {category}
        </div>
      )}

      {/* Bottom Right Aspect Ratio Tag */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          fontSize: '0.65rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
        }}
      >
        {aspectRatio} · 2400×{aspectRatio === '16:9' ? '1350' : aspectRatio === '4:3' ? '1800' : '2400'}
      </div>

      <style jsx>{`
        .image-placeholder-root {
          transition: border-color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .image-placeholder-root:hover {
          border-color: var(--color-brand-blue);
          transform: scale(1.008);
        }
      `}</style>
    </div>
  );
}
