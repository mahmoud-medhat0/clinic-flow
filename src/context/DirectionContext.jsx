import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Import translations
import en from '../i18n/en.json';
import ar from '../i18n/ar.json';
import he from '../i18n/he.json';
import fr from '../i18n/fr.json';

// Direction Context for RTL/LTR support
const DirectionContext = createContext();

export const useDirection = () => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
};

// Custom hook for translations
export const useTranslation = () => {
  const { translations, language } = useDirection();
  
  const t = (key, defaultValue = '') => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return typeof value === 'string' ? value : defaultValue || key;
  };
  
  return { t, language };
};

export const DirectionProvider = ({ children }) => {
  const [direction, setDirection] = useState(() => {
    const saved = localStorage.getItem('app-direction');
    return saved || 'ltr';
  });

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('app-language');
    return saved || 'en';
  });

  // Language to direction mapping
  const languageConfig = {
    en: { name: 'English', dir: 'ltr', flag: '🇺🇸' },
    ar: { name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
    he: { name: 'עברית', dir: 'rtl', flag: '🇮🇱' },
    fr: { name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  };

  const translations = useMemo(() => {
    const files = { en, ar, he, fr };
    return files[language] || en;
  }, [language]);

  const toggleDirection = () => {
    setDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr');
  };

  const changeLanguage = (lang) => {
    if (languageConfig[lang]) {
      setLanguage(lang);
      setDirection(languageConfig[lang].dir);
    }
  };

  useEffect(() => {
    localStorage.setItem('app-direction', direction);
    localStorage.setItem('app-language', language);
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
  }, [direction, language]);

  const value = {
    direction,
    setDirection,
    toggleDirection,
    language,
    setLanguage,
    changeLanguage,
    languageConfig,
    isRTL: direction === 'rtl',
    translations,
  };

  return (
    <DirectionContext.Provider value={value}>
      <div dir={direction} className={`app-root ${direction}`}>
        {children}
      </div>
    </DirectionContext.Provider>
  );
};

export default DirectionContext;
