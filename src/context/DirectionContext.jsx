import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Import translations
import en from '../i18n/en.json';
import ar from '../i18n/ar.json';
import fr from '../i18n/fr.json';

// Direction Context for RTL/LTR support and Theme
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

// Custom hook for theme
export const useTheme = () => {
  const { theme, toggleTheme, isDark } = useDirection();
  return { theme, toggleTheme, isDark };
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

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app-theme');
    if (saved) return saved;
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Language to direction mapping
  const languageConfig = {
    en: { name: 'English', dir: 'ltr', flag: '🇺🇸' },
    ar: { name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
    fr: { name: 'Français', dir: 'ltr', flag: '🇫🇷' },
  };

  const translations = useMemo(() => {
    const files = { en, ar, fr };
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

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setTheme(mode);
    }
  };

  useEffect(() => {
    localStorage.setItem('app-direction', direction);
    localStorage.setItem('app-language', language);
    localStorage.setItem('app-theme', theme);
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('data-theme', theme);
  }, [direction, language, theme]);

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
    theme,
    setTheme: setThemeMode,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return (
    <DirectionContext.Provider value={value}>
      <div dir={direction} className={`app-root ${direction} ${theme}`}>
        {children}
      </div>
    </DirectionContext.Provider>
  );
};

export default DirectionContext;

