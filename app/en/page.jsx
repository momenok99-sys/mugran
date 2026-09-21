'use client';

import React, { useEffect } from 'react';
import HomePage from '../page';
import { useLanguage } from '../../context/LanguageContext';

export default function EnglishPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <HomePage />;
}
