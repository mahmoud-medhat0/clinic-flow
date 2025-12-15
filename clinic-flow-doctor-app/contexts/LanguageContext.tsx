import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import en from '../i18n/en.json';
import ar from '../i18n/ar.json';
import fr from '../i18n/fr.json';

type Language = 'en' | 'ar' | 'fr';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = { en, ar, fr };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const isRTL = language === 'ar';

  const changeLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    const rtl = lang === 'ar';
    if (I18nManager.isRTL !== rtl) {
      I18nManager.allowRTL(rtl);
      I18nManager.forceRTL(rtl);
    }
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    return typeof value === 'string' ? value : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, isRTL, changeLanguage, t }}>
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

export function useTranslation() {
  const { t, language } = useLanguage();
  return { t, language };
}
