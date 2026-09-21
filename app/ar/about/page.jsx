'use client';

import React, { useEffect } from 'react';
import AboutPage from '../../about/page';
import { useLanguage } from '../../../context/LanguageContext';

export default function ArabicAboutPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('ar');
  }, [setLanguage]);

  return <AboutPage />;
}
