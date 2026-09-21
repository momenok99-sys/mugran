import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
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
          padding: '3.5rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(11, 17, 54, 0.08)',
          border: '1px solid rgba(11, 17, 54, 0.08)',
        }}
      >
        <span
          style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            color: '#2A4A9F',
            lineHeight: 1,
            display: 'block',
            marginBottom: '1rem',
            fontFamily: "'Space Mono', monospace",
          }}
        >
          404
        </span>

        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '0.75rem',
            color: '#0B1136',
          }}
        >
          الصفحة غير موجودة
        </h2>

        <p
          style={{
            fontSize: '1rem',
            color: '#64748B',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
        </p>

        <Link
          href="/"
          style={{
            backgroundColor: '#0B1136',
            color: '#FFFFFF',
            padding: '12px 28px',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: 700,
            display: 'inline-block',
            transition: 'background-color 0.2s ease',
          }}
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
