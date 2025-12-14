import React from 'react';
import { Phone, MapPin, Clock, Star, CheckCircle, Calendar, Users, Heart, Award, Shield, Stethoscope, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../context/DirectionContext';
import { Link } from 'react-router-dom';

// Hero Section
const ClinicHero = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary-200/30 dark:bg-primary-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-teal-200/30 dark:bg-teal-600/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Stethoscope className="w-4 h-4" />
              {t('clinic.hero.badge')}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {t('clinic.hero.title')}
              <span className="block bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
                {t('clinic.hero.titleHighlight')}
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              {t('clinic.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/clinic/book"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold text-lg shadow-glow hover:shadow-glow-teal hover:scale-105 transition-all"
              >
                <Calendar className="w-5 h-5" />
                {t('clinic.hero.bookNow')}
              </Link>
              <a
                href="tel:+201234567890"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold text-lg shadow-soft-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-all"
              >
                <Phone className="w-5 h-5 text-primary-500" />
                {t('clinic.hero.callUs')}
              </a>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-500" />
                <span>{t('clinic.hero.trust1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-500" />
                <span>{t('clinic.hero.trust2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-500" />
                <span>{t('clinic.hero.trust3')}</span>
              </div>
            </div>
          </div>
          
          {/* Image/Visual */}
          <div className="relative hidden lg:block">
            <div className="relative bg-gradient-to-br from-primary-100 to-teal-100 dark:from-primary-900/30 dark:to-teal-900/30 rounded-3xl p-8 shadow-soft-xl">
              <div className="aspect-[4/3] bg-white dark:bg-gray-800 rounded-2xl shadow-soft flex items-center justify-center">
                <Stethoscope className="w-32 h-32 text-primary-200 dark:text-primary-700" />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-soft-lg p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">+5000</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('clinic.hero.happyPatients')}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-soft-lg p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">4.9/5</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('clinic.hero.rating')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutClinic = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-teal-100 dark:from-primary-900/30 dark:to-teal-900/30 rounded-3xl flex items-center justify-center">
              <Heart className="w-24 h-24 text-primary-300 dark:text-primary-600" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-primary-500 to-teal-500 text-white rounded-2xl p-6 shadow-glow">
              <p className="text-4xl font-bold">15+</p>
              <p className="text-sm opacity-90">{t('clinic.about.yearsExperience')}</p>
            </div>
          </div>
          
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
              {t('clinic.about.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('clinic.about.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {t('clinic.about.description')}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t('clinic.about.description2')}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Award, label: t('clinic.about.feature1') },
                { icon: Users, label: t('clinic.about.feature2') },
                { icon: Shield, label: t('clinic.about.feature3') },
                { icon: Heart, label: t('clinic.about.feature4') },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Doctors Section
const DoctorProfiles = () => {
  const { t } = useTranslation();
  
  const doctors = [
    { nameKey: 'clinic.doctors.doctor1Name', roleKey: 'clinic.doctors.doctor1Role', experienceKey: 'clinic.doctors.doctor1Experience' },
    { nameKey: 'clinic.doctors.doctor2Name', roleKey: 'clinic.doctors.doctor2Role', experienceKey: 'clinic.doctors.doctor2Experience' },
    { nameKey: 'clinic.doctors.doctor3Name', roleKey: 'clinic.doctors.doctor3Role', experienceKey: 'clinic.doctors.doctor3Experience' },
  ];
  
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
            {t('clinic.doctors.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('clinic.doctors.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('clinic.doctors.description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {doctors.map((doctor, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-soft hover:shadow-soft-xl transition-all group">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-teal-100 dark:from-primary-900/30 dark:to-teal-900/30 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t(doctor.nameKey)}</h3>
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">{t(doctor.roleKey)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t(doctor.experienceKey)}</p>
                <Link
                  to="/clinic/book"
                  className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all"
                >
                  {t('clinic.doctors.bookWith')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Services Section
const Services = () => {
  const { t } = useTranslation();
  
  const services = [
    { icon: Stethoscope, nameKey: 'clinic.services.service1', descKey: 'clinic.services.service1Desc' },
    { icon: Heart, nameKey: 'clinic.services.service2', descKey: 'clinic.services.service2Desc' },
    { icon: Users, nameKey: 'clinic.services.service3', descKey: 'clinic.services.service3Desc' },
    { icon: Shield, nameKey: 'clinic.services.service4', descKey: 'clinic.services.service4Desc' },
    { icon: Award, nameKey: 'clinic.services.service5', descKey: 'clinic.services.service5Desc' },
    { icon: Clock, nameKey: 'clinic.services.service6', descKey: 'clinic.services.service6Desc' },
  ];
  
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-sm font-medium mb-4">
            {t('clinic.services.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('clinic.services.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('clinic.services.description')}
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gradient-to-br hover:from-primary-500 hover:to-teal-500 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/50 group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors">
                <service.icon className="w-7 h-7 text-primary-600 dark:text-primary-400 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-white mb-2">{t(service.nameKey)}</h3>
              <p className="text-gray-600 dark:text-gray-300 group-hover:text-white/80 text-sm">{t(service.descKey)}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link
            to="/clinic/book"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold shadow-glow hover:shadow-glow-teal hover:scale-105 transition-all"
          >
            <Calendar className="w-5 h-5" />
            {t('clinic.services.bookAppointment')}
          </Link>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const PatientReviews = () => {
  const { t } = useTranslation();
  
  const reviews = [
    { nameKey: 'clinic.reviews.review1Name', textKey: 'clinic.reviews.review1Text', rating: 5 },
    { nameKey: 'clinic.reviews.review2Name', textKey: 'clinic.reviews.review2Text', rating: 5 },
    { nameKey: 'clinic.reviews.review3Name', textKey: 'clinic.reviews.review3Text', rating: 5 },
  ];
  
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-sm font-medium mb-4">
            {t('clinic.reviews.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('clinic.reviews.title')}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-soft">
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{t(review.textKey)}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold">
                  {t(review.nameKey).charAt(0)}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{t(review.nameKey)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Location Section
const ClinicLocation = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
            {t('clinic.location.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('clinic.location.title')}
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map placeholder */}
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600" />
          </div>
          
          {/* Contact info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('clinic.location.address')}</h4>
                <p className="text-gray-600 dark:text-gray-300">{t('clinic.location.addressValue')}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('clinic.location.phone')}</h4>
                <p className="text-gray-600 dark:text-gray-300">+20 123 456 7890</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('clinic.location.hours')}</h4>
                <p className="text-gray-600 dark:text-gray-300">{t('clinic.location.hoursValue')}</p>
              </div>
            </div>
            
            <Link
              to="/clinic/book"
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold shadow-glow hover:shadow-glow-teal hover:scale-105 transition-all"
            >
              <Calendar className="w-5 h-5" />
              {t('clinic.location.bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const ClinicFooter = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('clinic.footer.clinicName')}</h3>
            <p className="text-gray-400 text-sm">{t('clinic.footer.tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('clinic.footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('clinic.footer.aboutUs')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('clinic.footer.services')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('clinic.footer.doctors')}</a></li>
              <li><Link to="/clinic/book" className="hover:text-white transition-colors">{t('clinic.footer.bookAppointment')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('clinic.footer.contact')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +20 123 456 7890</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {t('clinic.location.addressValue')}</li>
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

// Main Clinic Home Component
const ClinicHome = () => {
  return (
    <div className="min-h-screen">
      <ClinicHero />
      <AboutClinic />
      <DoctorProfiles />
      <Services />
      <PatientReviews />
      <ClinicLocation />
      <ClinicFooter />
    </div>
  );
};

export default ClinicHome;
