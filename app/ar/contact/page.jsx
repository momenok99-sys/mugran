'use client';

import React, { useEffect, Suspense } from 'react';
import ContactPage from '../../contact/page';
import { useLanguage } from '../../../context/LanguageContext';

function ArabicContactContent() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('ar');
  }, [setLanguage]);

  return <ContactPage />;
}

export default function ArabicContactPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }} />}>
      <ArabicContactContent />
    </Suspense>
  );
}
