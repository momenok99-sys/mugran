'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const [lang, setLang] = useState(() => (pathname.startsWith('/ar') ? 'ar' : 'en'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);

  // Sync language with pathname
  useEffect(() => {
    if (pathname.startsWith('/ar')) {
      setLang('ar');
      localStorage.setItem('mugran_lang', 'ar');
    } else if (pathname.startsWith('/en')) {
      setLang('en');
      localStorage.setItem('mugran_lang', 'en');
    } else {
      const saved = localStorage.getItem('mugran_lang');
      if (saved === 'ar' || saved === 'en') {
        setLang(saved);
      }
    }
  }, [pathname]);

  const toggleLang = useCallback(() => {
    const next = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    localStorage.setItem('mugran_lang', next);

    // Compute target route
    let purePath = pathname;
    if (purePath.startsWith('/ar')) {
      purePath = purePath.replace(/^\/ar/, '') || '/';
    } else if (purePath.startsWith('/en')) {
      purePath = purePath.replace(/^\/en/, '') || '/';
    }

    if (next === 'ar') {
      router.push(purePath === '/' ? '/ar' : `/ar${purePath}`);
    } else {
      router.push(purePath === '/' ? '/en' : `/en${purePath}`);
    }
  }, [lang, pathname, router]);

  const setSpecificLang = useCallback((newLang) => {
    if (newLang === 'en' || newLang === 'ar') {
      setLang(newLang);
      localStorage.setItem('mugran_lang', newLang);
    }
  }, []);

  const isRTL = lang === 'ar';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }
  }, [lang, isRTL]);

  const openProjectModal = useCallback((preselectedChallenge = null) => {
    if (preselectedChallenge) {
      setActiveChallenge(preselectedChallenge);
    }
    setIsModalOpen(true);
  }, []);

  const closeProjectModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isRTL,
        toggleLang,
        setLanguage: setSpecificLang,
        isModalOpen,
        openProjectModal,
        closeProjectModal,
        activeChallenge,
        setActiveChallenge,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
