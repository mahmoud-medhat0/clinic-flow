import React from 'react';
import { Calendar, Users, FileText, Bell, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Calendar,
      titleKey: 'landing.features.appointmentManagement',
      descriptionKey: 'landing.features.appointmentManagementDesc',
      color: 'primary',
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30',
    },
    {
      icon: Users,
      titleKey: 'landing.features.patientRecords',
      descriptionKey: 'landing.features.patientRecordsDesc',
      color: 'teal',
      gradient: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30',
    },
    {
      icon: FileText,
      titleKey: 'landing.features.smartBilling',
      descriptionKey: 'landing.features.smartBillingDesc',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
    },
    {
      icon: Bell,
      titleKey: 'landing.features.automatedNotifications',
      descriptionKey: 'landing.features.automatedNotificationsDesc',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
    },
  ];

  const FeatureCard = ({ feature, index }) => (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 h-full"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.gradient} bg-clip-text`} style={{ color: feature.color === 'primary' ? '#1890ff' : feature.color === 'teal' ? '#13c2c2' : feature.color === 'green' ? '#22c55e' : '#a855f7' }} />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {t(feature.titleKey)}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
        {t(feature.descriptionKey)}
      </p>

      {/* Learn More Link */}
      <button
        type="button"
        className={`inline-flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent group-hover:gap-2 transition-all duration-300`}
      >
        {t('landing.features.learnMore')}
        <ArrowRight className="w-4 h-4" style={{ color: feature.color === 'primary' ? '#1890ff' : feature.color === 'teal' ? '#13c2c2' : feature.color === 'green' ? '#22c55e' : '#a855f7' }} />
      </button>

      {/* Hover gradient border effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
    </div>
  );

  return (
    <section id="features" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-teal-500 to-primary-500" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 dark:from-primary-900/50 dark:to-teal-900/50 text-primary-700 dark:text-primary-300 font-medium text-sm mb-4">
            {t('landing.features.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('landing.features.title')}{' '}
            <span className="bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
              {t('landing.features.titleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('landing.features.description')}
          </p>
        </div>

        {/* Mobile Swiper */}
        <div className="md:hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.15}
            centeredSlides={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="pb-12"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={feature.titleKey}>
                <FeatureCard feature={feature} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.titleKey} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

