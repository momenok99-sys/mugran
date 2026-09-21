'use client';

import React, { useEffect } from 'react';
import ServicesPage from '../../services/page';
import { useLanguage } from '../../../context/LanguageContext';

export default function ArabicServicesPage() {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('ar');
  }, [setLanguage]);

  return <ServicesPage />;
}
