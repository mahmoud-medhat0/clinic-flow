import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import en from '../i18n/en.json';
import ar from '../i18n/ar.json';
import fr from '../i18n/fr.json';

export type Language = 'en' | 'ar' | 'fr';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  changeLanguage: (lang: Language) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Language, Translations> = { en, ar, fr };
const STORAGE_KEY = 'patient-app-language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getDeviceLanguage(): Language {
  const locale = Localization.getLocales()[0]?.languageCode || 'en';
  if (locale === 'ar') return 'ar';
  if (locale === 'fr') return 'fr';
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved language on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLang && (savedLang === 'en' || savedLang === 'ar' || savedLang === 'fr')) {
          setLanguage(savedLang as Language);
          // Apply RTL immediately on load
          const rtl = savedLang === 'ar';
          if (I18nManager.isRTL !== rtl) {
            I18nManager.allowRTL(rtl);
            I18nManager.forceRTL(rtl);
          }
        } else {
          // Use device language as fallback
          const deviceLang = getDeviceLanguage();
          setLanguage(deviceLang);
          const rtl = deviceLang === 'ar';
          if (I18nManager.isRTL !== rtl) {
            I18nManager.allowRTL(rtl);
            I18nManager.forceRTL(rtl);
          }
        }
      } catch (error) {
        console.error('Failed to load language', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadLanguage();
  }, []);

  const isRTL = language === 'ar';
  const direction: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';

  const changeLanguage = useCallback(async (lang: Language) => {
    setLanguage(lang);
    const rtl = lang === 'ar';
    
    if (I18nManager.isRTL !== rtl) {
      I18nManager.allowRTL(rtl);
      I18nManager.forceRTL(rtl);
    }
    
    // Save to storage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.error('Failed to save language', error);
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    if (typeof value !== 'string') return key;
    
    // Replace parameters like {{name}}
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() ?? `{{${paramKey}}}`;
      });
    }
    
    return value;
  }, [language]);

  const value = useMemo(() => ({
    language,
    isRTL,
    direction,
    changeLanguage,
    t
  }), [language, isRTL, direction, changeLanguage, t]);

  // Don't render until language is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={value}>
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
  const { t, language, isRTL, direction } = useLanguage();
  return { t, language, isRTL, direction };
}
