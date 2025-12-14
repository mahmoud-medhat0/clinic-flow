import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation, useDirection, useTheme } from '../../../context/DirectionContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ClinicNavbar = () => {
  const { t } = useTranslation();
  const { languageConfig, language, changeLanguage, isRTL } = useDirection();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isOnClinicHome = location.pathname === '/clinic';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    // If on clinic home page, scroll to section
    if (isOnClinicHome) {
      if (href === '#home' || href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // If on booking or other page, navigate to clinic page with hash
      navigate(`/clinic${href}`);
    }
  };

  const navLinks = [
    { label: t('clinic.nav.home'), href: '#home' },
    { label: t('clinic.nav.about'), href: '#about' },
    { label: t('clinic.nav.services'), href: '#services' },
    { label: t('clinic.nav.doctors'), href: '#doctors' },
    { label: t('clinic.nav.contact'), href: '#contact' },
  ];

  return (
    <>
      <nav 
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-soft' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/clinic" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">+</span>
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
                {t('clinic.footer.clinicName')}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                {isLangMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-soft-xl border border-gray-100 dark:border-gray-700 py-2 min-w-[140px]">
                    {Object.entries(languageConfig).map(([code, config]) => (
                      <button
                        key={code}
                        onClick={() => {
                          changeLanguage(code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-start flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          language === code ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span>{config.flag}</span>
                        <span>{config.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Call Button - Desktop */}
              <a
                href="tel:+201234567890"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">{t('clinic.nav.call')}</span>
              </a>

              {/* Book Appointment Button */}
              <Link
                to="/clinic/book"
                className="hidden sm:flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold shadow-glow hover:shadow-glow-teal hover:scale-105 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden md:inline">{t('clinic.nav.book')}</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isMobileMenuOpen ? 'visible' : 'invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-xl transition-transform ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <a
                href="tel:+201234567890"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium"
              >
                <Phone className="w-5 h-5" />
                {t('clinic.nav.call')}
              </a>
              <Link
                to="/clinic/book"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold"
              >
                <Calendar className="w-5 h-5" />
                {t('clinic.nav.book')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClinicNavbar;
