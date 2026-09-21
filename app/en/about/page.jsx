'use client';

import React, { useEffect } from 'react';
import AboutPage from '../../about/page';
import { useLanguage } from '../../../context/LanguageContext';

export default function EnglishAboutPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <AboutPage />;
}
