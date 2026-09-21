'use client';

import React, { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Next.js Global Root Error:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8FAFC',
          fontFamily: "'Cairo', -apple-system, sans-serif",
          color: '#0B1136',
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            width: '90%',
            backgroundColor: '#FFFFFF',
            padding: '3rem 2rem',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(11, 17, 54, 0.08)',
            border: '1px solid rgba(11, 17, 54, 0.08)',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            حدث خطأ في النظام
          </h2>
          <p style={{ color: '#64748B', marginBottom: '2rem', lineHeight: 1.6 }}>
            حدث خلل غير متوقع أثناء تحميل الصفحة. يرجى إعادة المحاولة.
          </p>
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
              border: 'none',
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
