import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { useTranslation, useDirection } from '../../../context/DirectionContext';
import { Link } from 'react-router-dom';

const ClinicFooter = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  
  return (
    <footer className="bg-gray-900 text-white py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8 text-center md:text-start">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('clinic.footer.clinicName')}</h3>
            <p className="text-gray-400 text-sm">{t('clinic.footer.tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('clinic.footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/clinic#about" className="hover:text-white transition-colors">{t('clinic.footer.aboutUs')}</Link></li>
              <li><Link to="/clinic#services" className="hover:text-white transition-colors">{t('clinic.footer.services')}</Link></li>
              <li><Link to="/clinic#doctors" className="hover:text-white transition-colors">{t('clinic.footer.doctors')}</Link></li>
              <li><Link to="/clinic/book" className="hover:text-white transition-colors">{t('clinic.footer.bookAppointment')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('clinic.footer.contact')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{t('clinic.location.addressValue')}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2024 {t('clinic.footer.clinicName')}. {t('clinic.footer.poweredBy')} <span className="text-primary-400">a2zenon ClinicFlow</span></p>
        </div>
      </div>
    </footer>
  );
};

export default ClinicFooter;
