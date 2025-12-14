import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Calendar, Globe, Check, Sun, Moon } from 'lucide-react';
import { useTranslation, useDirection } from '../../../context/DirectionContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { t } = useTranslation();
  const { language, changeLanguage, languageConfig, toggleTheme, isDark } = useDirection();
  const languageMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { nameKey: 'landing.navbar.features', href: '#features' },
    { nameKey: 'landing.navbar.howItWorks', href: '#how-it-works' },
    { nameKey: 'landing.navbar.pricing', href: '#pricing' },
    { nameKey: 'landing.navbar.faq', href: '#faq' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setShowLanguageMenu(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-soft-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-glow">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
                  a2zenon
                </span>
                <span className="text-xl font-semibold text-gray-800 dark:text-white ml-1">
                  ClinicFlow
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.nameKey}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 relative group"
              >
                {t(link.nameKey)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-teal-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Language Switcher */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Select language"
              >
                <Globe className="w-5 h-5" />
                <span className="text-lg">{languageConfig[language]?.flag}</span>
              </button>

              {showLanguageMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-soft-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  <div className="p-2">
                    {Object.entries(languageConfig).map(([code, config]) => (
                      <button
                        key={code}
                        onClick={() => handleLanguageChange(code)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                          language === code
                            ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-lg">{config.flag}</span>
                        <span className="flex-1 text-left font-medium">{config.name}</span>
                        {language === code && (
                          <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="/login"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200"
            >
              {t('landing.navbar.login')}
            </a>
            <a
              href="#cta"
              onClick={(e) => scrollToSection(e, '#cta')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold shadow-glow hover:shadow-glow-teal hover:scale-105 transition-all duration-300"
            >
              {t('landing.navbar.startFreeTrial')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.nameKey}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="block py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              {t(link.nameKey)}
            </a>
          ))}
          
          {/* Mobile Language Switcher */}
          <div className="py-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('topbar.selectLanguage')}</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(languageConfig).map(([code, config]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    language === code
                      ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span>{config.flag}</span>
                  <span className="text-sm font-medium">{config.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile Theme Toggle */}
          <div className="py-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
          
          <hr className="my-3 border-gray-100 dark:border-gray-800" />
          <a
            href="/login"
            className="block py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
          >
            {t('landing.navbar.login')}
          </a>
          <a
            href="#cta"
            onClick={(e) => scrollToSection(e, '#cta')}
            className="block w-full text-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold shadow-glow"
          >
            {t('landing.navbar.startFreeTrial')}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
