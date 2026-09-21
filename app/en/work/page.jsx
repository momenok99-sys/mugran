'use client';

import React, { useEffect } from 'react';
import WorkPage from '../../work/page';
import { useLanguage } from '../../../context/LanguageContext';

export default function EnglishWorkPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <WorkPage />;
}
