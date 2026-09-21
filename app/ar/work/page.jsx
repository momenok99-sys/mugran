'use client';

import React, { useEffect } from 'react';
import WorkPage from '../../work/page';
import { useLanguage } from '../../../context/LanguageContext';

export default function ArabicWorkPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('ar');
  }, [setLanguage]);

  return <WorkPage />;
}
