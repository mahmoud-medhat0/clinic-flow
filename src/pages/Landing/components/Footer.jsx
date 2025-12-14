import React from 'react';
import { Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const scrollToSection = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-start">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-teal-400 bg-clip-text text-transparent">
                  a2zenon
                </span>
                <span className="text-xl font-semibold text-white ml-1">
                  ClinicFlow
                </span>
              </div>
            </a>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md mx-auto lg:mx-0">
              {t('landing.footer.tagline')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:support@a2zenon.com" className="flex items-center justify-center lg:justify-start gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>support@a2zenon.com</span>
              </a>
              <a href="tel:+20123456789" className="flex items-center justify-center lg:justify-start gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>+20 123 456 789</span>
              </a>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Cairo, Egypt</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('landing.footer.product')}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  onClick={(e) => scrollToSection(e, '#features')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t('landing.footer.features')}
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, '#how-it-works')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t('landing.navbar.howItWorks')}
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => scrollToSection(e, '#pricing')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t('landing.footer.pricing')}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => scrollToSection(e, '#faq')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t('landing.navbar.faq')}
                </a>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('landing.footer.resources')}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/login"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t('landing.navbar.login')}
                </a>
              </li>
              <li>
                <a
                  href="#cta"
                  onClick={(e) => scrollToSection(e, '#cta')}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t('landing.navbar.startFreeTrial')}
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@a2zenon.com"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {t('landing.faq.contactSupport')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm text-center">
              © {currentYear} a2zenon ClinicFlow. {t('landing.footer.allRightsReserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

