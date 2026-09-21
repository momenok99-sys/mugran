'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Button({
  children,
  href = null,
  onClick = null,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = true,
  cursorTag = '',
  className = '',
  style = {},
  type = 'button',
  disabled = false,
}) {
  const { isRTL } = useLanguage();

  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '0.825rem' },
    md: { padding: '12px 24px', fontSize: '0.925rem' },
    lg: { padding: '16px 32px', fontSize: '1.025rem' },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  let baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontWeight: 700,
    borderRadius: '40px', // Sophisticated pill curvature
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    fontFamily: 'inherit',
    position: 'relative',
    ...currentSize,
    ...style,
  };

  if (variant === 'primary') {
    baseStyles = {
      ...baseStyles,
      backgroundColor: 'var(--color-brand-ink)',
      color: '#FFFFFF',
      border: '1px solid var(--color-brand-ink)',
      boxShadow: '0 2px 8px rgba(11, 19, 56, 0.12)',
    };
  } else if (variant === 'secondary') {
    baseStyles = {
      ...baseStyles,
      backgroundColor: 'var(--bg-surface)',
      color: 'var(--color-brand-ink)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-sm)',
    };
  } else if (variant === 'outline') {
    baseStyles = {
      ...baseStyles,
      backgroundColor: 'transparent',
      color: 'var(--color-brand-ink)',
      border: '1px solid var(--border-medium)',
    };
  } else if (variant === 'ghost') {
    baseStyles = {
      ...baseStyles,
      backgroundColor: 'transparent',
      color: 'var(--color-brand-blue)',
      border: 'none',
      paddingLeft: 0,
      paddingRight: 0,
      gap: '8px',
    };
  }

  // Nested Button-in-Button Icon Circle
  const iconPill = icon && (
    <span
      className="btn-icon-pill"
      style={{
        width: size === 'sm' ? '20px' : size === 'lg' ? '28px' : '24px',
        height: size === 'sm' ? '20px' : size === 'lg' ? '28px' : '24px',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: variant === 'primary' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(11, 19, 56, 0.06)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
      }}
    >
      <svg
        width={size === 'sm' ? '10' : '12'}
        height={size === 'sm' ? '10' : '12'}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: isRTL ? 'scaleX(-1)' : 'none',
          transition: 'transform 0.3s ease',
        }}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </span>
  );

  const content = (
    <>
      <span>{children}</span>
      {iconPill}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`mugran-btn-root ${variant} ${className}`}
        style={baseStyles}
        data-cursor={cursorTag || 'CLICK'}
      >
        {content}
        <style jsx>{`
          .mugran-btn-root.primary:hover {
            background-color: var(--color-brand-blue) !important;
            border-color: var(--color-brand-blue) !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px -4px rgba(42, 74, 159, 0.3) !important;
          }
          .mugran-btn-root.secondary:hover,
          .mugran-btn-root.outline:hover {
            border-color: var(--color-brand-ink) !important;
            background-color: var(--bg-subtle) !important;
            transform: translateY(-2px);
          }
          .mugran-btn-root.ghost:hover {
            color: var(--color-brand-blue-hover) !important;
          }
          .mugran-btn-root:hover :global(.btn-icon-pill) {
            transform: ${isRTL ? 'translateX(-3px)' : 'translateX(3px)'};
            background-color: rgba(255, 255, 255, 0.28);
          }
          .mugran-btn-root:active {
            transform: translateY(0px) scale(0.98);
          }
        `}</style>
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`mugran-btn-root ${variant} ${className}`}
      style={baseStyles}
      data-cursor={cursorTag || 'SUBMIT'}
    >
      {content}
      <style jsx>{`
        .mugran-btn-root.primary:hover:not(:disabled) {
          background-color: var(--color-brand-blue) !important;
          border-color: var(--color-brand-blue) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px -4px rgba(42, 74, 159, 0.3) !important;
        }
        .mugran-btn-root.secondary:hover:not(:disabled),
        .mugran-btn-root.outline:hover:not(:disabled) {
          border-color: var(--color-brand-ink) !important;
          background-color: var(--bg-subtle) !important;
          transform: translateY(-2px);
        }
        .mugran-btn-root:hover:not(:disabled) :global(.btn-icon-pill) {
          transform: ${isRTL ? 'translateX(-3px)' : 'translateX(3px)'};
        }
        .mugran-btn-root:active:not(:disabled) {
          transform: translateY(0px) scale(0.98);
        }
      `}</style>
    </button>
  );
}
