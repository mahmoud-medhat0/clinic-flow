import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import en from '../i18n/en.json';
import ar from '../i18n/ar.json';
import fr from '../i18n/fr.json';

type Language = 'en' | 'ar' | 'fr';
type Translations = typeof en | typeof ar | typeof fr;

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
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved language on mount and apply RTL settings
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('user-language');
        if (savedLang && (savedLang === 'en' || savedLang === 'ar' || savedLang === 'fr')) {
          const shouldBeRTL = savedLang === 'ar';
          
          // Apply RTL settings on startup if needed
          if (I18nManager.isRTL !== shouldBeRTL) {
            I18nManager.allowRTL(shouldBeRTL);
            I18nManager.forceRTL(shouldBeRTL);
          }
          
          setLanguage(savedLang as Language);
        } else {
          // No saved language, ensure RTL matches default (English = LTR)
          if (I18nManager.isRTL) {
            I18nManager.allowRTL(false);
            I18nManager.forceRTL(false);
          }
        }
      } catch (error) {
        console.error('Failed to load language', error);
      } finally {
        setIsInitialized(true);
      }
    };
    loadLanguage();
  }, []);

  // Use I18nManager.isRTL as source of truth for native components,
  // but also check language for immediate UI updates before restart
  const isRTL = I18nManager.isRTL || language === 'ar';

  const changeLanguage = useCallback(async (lang: Language) => {
    const currentIsRTL = language === 'ar';
    const newIsRTL = lang === 'ar';
    
    // Save to storage first
    try {
      await AsyncStorage.setItem('user-language', lang);
    } catch (error) {
      console.error('Failed to save language', error);
    }

    // Update language state immediately
    setLanguage(lang);

    // Check if RTL direction is changing
    if (currentIsRTL !== newIsRTL) {
      // Apply RTL settings
      I18nManager.allowRTL(newIsRTL);
      I18nManager.forceRTL(newIsRTL);
      
      // Auto reload the app (silently fails in dev mode)
      try {
        await Updates.reloadAsync();
      } catch (e) {
        // In development mode, Updates.reloadAsync() won't work
        // The UI will still update via the isRTL state
        console.log('Dev mode: Manual restart needed for full RTL effect');
      }
    }
  }, [language]);

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

  const value = useMemo(() => ({
    language,
    isRTL,
    changeLanguage,
    t
  }), [language, isRTL, changeLanguage, t]);

  // Don't render until language is loaded to prevent flash
  if (!isInitialized) {
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
  const { t, language } = useLanguage();
  return { t, language };
}
