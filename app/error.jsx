'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Next.js App Error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        color: '#0B1136',
        padding: '24px',
        textAlign: 'center',
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          padding: '3rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(11, 17, 54, 0.08)',
          border: '1px solid rgba(11, 17, 54, 0.08)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '0.75rem',
            color: '#0B1136',
          }}
        >
          حدث خطأ غير متوقع
        </h2>

        <p
          style={{
            fontSize: '1rem',
            color: '#64748B',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          نعتذر عن هذا الخلل. يمكنك إعادة المحاولة الآن أو العودة إلى الصفحة الرئيسية.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: '#0B1136',
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#141D4E')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0B1136')}
          >
            إعادة المحاولة
          </button>

          <Link
            href="/"
            style={{
              backgroundColor: '#F1F4F9',
              color: '#0B1136',
              padding: '10px 24px',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
