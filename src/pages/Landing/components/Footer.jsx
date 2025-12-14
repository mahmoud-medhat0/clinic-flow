import React from 'react';
import { Calendar, Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const footerLinks = {
    product: {
      titleKey: 'landing.footer.product',
      links: [
        { nameKey: 'landing.footer.features', href: '#features' },
        { nameKey: 'landing.footer.pricing', href: '#pricing' },
        { nameKey: 'landing.footer.integrations', href: '#' },
        { nameKey: 'landing.footer.api', href: '#' },
        { nameKey: 'landing.footer.changelog', href: '#' },
      ]
    },
    company: {
      titleKey: 'landing.footer.company',
      links: [
        { nameKey: 'landing.footer.aboutUs', href: '#' },
        { nameKey: 'landing.footer.careers', href: '#' },
        { nameKey: 'landing.footer.blog', href: '#' },
        { nameKey: 'landing.footer.press', href: '#' },
        { nameKey: 'landing.footer.partners', href: '#' },
      ]
    },
    resources: {
      titleKey: 'landing.footer.resources',
      links: [
        { nameKey: 'landing.footer.documentation', href: '#' },
        { nameKey: 'landing.footer.helpCenter', href: '#' },
        { nameKey: 'landing.footer.community', href: '#' },
        { nameKey: 'landing.footer.webinars', href: '#' },
        { nameKey: 'landing.footer.status', href: '#' },
      ]
    },
    legal: {
      titleKey: 'landing.footer.legal',
      links: [
        { nameKey: 'landing.footer.privacyPolicy', href: '#' },
        { nameKey: 'landing.footer.termsOfService', href: '#' },
        { nameKey: 'landing.footer.hipaaCompliance', href: '#' },
        { nameKey: 'landing.footer.security', href: '#' },
        { nameKey: 'landing.footer.cookiePolicy', href: '#' },
      ]
    },
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

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
        <div className="grid lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
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
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('landing.footer.tagline')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:hello@clinicflow.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>hello@clinicflow.com</span>
              </a>
              <a href="tel:+1-800-CLINIC" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>1-800-CLINIC</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Medical Drive, Suite 100<br />San Francisco, CA 94105</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([key, category]) => (
            <div key={key}>
              <h3 className="text-white font-semibold mb-4">{t(category.titleKey)}</h3>
              <ul className="space-y-3">
                {category.links.map((link) => (
                  <li key={link.nameKey}>
                    <a
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {t(link.nameKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              © {currentYear} a2zenon ClinicFlow. {t('landing.footer.allRightsReserved')}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-primary-500 hover:to-teal-500 hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

