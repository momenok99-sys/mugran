'use client';

import React, { useEffect } from 'react';
import ServicesPage from '../../services/page';
import { useLanguage } from '../../../context/LanguageContext';

export default function EnglishServicesPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  return <ServicesPage />;
}
