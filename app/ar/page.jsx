'use client';

import React, { useEffect } from 'react';
import HomePage from '../page';
import { useLanguage } from '../../context/LanguageContext';

export default function ArabicPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('ar');
  }, [setLanguage]);

  return <HomePage />;
}
