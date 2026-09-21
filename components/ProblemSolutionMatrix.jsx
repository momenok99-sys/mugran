'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { siteContent } from '../data/content';

export default function ProblemSolutionMatrix() {
  const { lang, isRTL, openProjectModal } = useLanguage();
  const t = siteContent[lang].problemSolution;
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeItem = t.items[selectedIdx] || t.items[0];

  const getLocalizedHref = (href) => {
    if (isRTL) {
      if (href === '/') return '/ar';
      return href.startsWith('/ar') ? href : `/ar${href}`;
    } else {
      return href.replace(/^\/ar/, '') || '/';
    }
  };

  return (
    <div
      className="double-bezel reveal-card"
      style={{
        width: '100%',
        marginTop: '2rem',
      }}
    >
      <div
        className="inner-core"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(320px, 1fr)',
          gap: '2.5rem',
          padding: '2.5rem',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Left: Problem Questions Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <span className="mugran-tag">
              [ {isRTL ? 'اختر التحدي الذي تواجهه' : 'SELECT YOUR CURRENT CHALLENGE'} ]
            </span>
          </div>

          {t.items.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                style={{
                  textAlign: isRTL ? 'right' : 'left',
                  padding: '1.15rem 1.4rem',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? 'var(--color-brand-blue-light)' : 'var(--bg-page)',
                  border: `1px solid ${isSelected ? 'var(--color-brand-blue)' : 'var(--border-subtle)'}`,
                  color: isSelected ? 'var(--color-brand-ink)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(42, 74, 159, 0.4)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-page)';
                  }
                }}
              >
                <span>{item.problem}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--color-brand-blue)' : 'var(--text-muted)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                    border: isSelected ? '1px solid var(--color-brand-blue)' : '1px solid transparent',
                    flexShrink: 0,
                  }}
                >
                  → {item.solutionRoute}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Interactive Solution Architecture Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-page)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '2rem',
            position: 'relative',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <span className="mugran-tag">
                [ {isRTL ? 'المسار الاستراتيجي الموصى به' : 'RECOMMENDED STRATEGIC PATH'} ]
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: 'var(--color-brand-blue)',
                  backgroundColor: 'var(--color-brand-blue-light)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '9999px',
                }}
              >
                {activeItem.solutionRoute}
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--color-brand-ink)',
                lineHeight: 1.25,
                marginBottom: '1rem',
              }}
            >
              {activeItem.action}
            </h3>

            <p
              style={{
                fontSize: '0.98rem',
                color: 'var(--text-secondary)',
                lineHeight: isRTL ? 1.8 : 1.65,
                marginBottom: '2rem',
              }}
            >
              {activeItem.desc}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href={getLocalizedHref(activeItem.link)}
              className="btn-magnetic btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.65rem 1.25rem' }}
            >
              <span>{isRTL ? 'استكشف تفاصيل هذا المسار' : 'EXPLORE THIS PATH'}</span>
              <span className="btn-icon-circle">↗</span>
            </Link>

            <button
              onClick={() => openProjectModal(activeItem.id)}
              className="btn-magnetic btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.65rem 1.25rem' }}
            >
              <span>{isRTL ? 'ناقش هذا التحدي معنا' : 'START WITH THIS'}</span>
              <span className="btn-icon-circle">+</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .inner-core {
            grid-template-columns: 1fr !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
