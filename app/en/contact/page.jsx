'use client';

import React, { useEffect, Suspense } from 'react';
import ContactPage from '../../contact/page';
import { useLanguage } from '../../../context/LanguageContext';

function EnglishContactContent() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <ContactPage />;
}

export default function EnglishContactPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }} />}>
      <EnglishContactContent />
    </Suspense>
  );
}
