import React, { useState } from 'react';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { t } = useTranslation();

  const plans = [
    {
      nameKey: 'landing.pricing.starter',
      descriptionKey: 'landing.pricing.starterDesc',
      icon: Sparkles,
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      featureKeys: [
        'landing.pricing.feature1Doctor',
        'landing.pricing.featureUpTo50',
        'landing.pricing.featureBasicScheduling',
        'landing.pricing.featurePatientRecords',
        'landing.pricing.featureEmailSupport',
        'landing.pricing.featureMobileApp',
      ],
      limitationKeys: [
        'landing.pricing.featureNoSMS',
        'landing.pricing.featureNoCustomBranding',
        'landing.pricing.featureLimitedReports',
      ],
      ctaKey: 'landing.pricing.getStartedFree',
      ctaStyle: 'secondary',
    },
    {
      nameKey: 'landing.pricing.professional',
      descriptionKey: 'landing.pricing.professionalDesc',
      icon: Zap,
      monthlyPrice: 29,
      annualPrice: 24,
      popular: true,
      featureKeys: [
        'landing.pricing.featureUpTo3Doctors',
        'landing.pricing.featureUnlimitedPatients',
        'landing.pricing.featureAdvancedScheduling',
        'landing.pricing.featureSMSEmail',
        'landing.pricing.featureOnlineBooking',
        'landing.pricing.featurePayments',
        'landing.pricing.featureCustomBranding',
        'landing.pricing.featureAnalytics',
        'landing.pricing.featurePrioritySupport',
      ],
      limitationKeys: [],
      ctaKey: 'landing.pricing.startFreeTrial',
      ctaStyle: 'primary',
    },
    {
      nameKey: 'landing.pricing.enterprise',
      descriptionKey: 'landing.pricing.enterpriseDesc',
      icon: Building2,
      monthlyPrice: 79,
      annualPrice: 66,
      popular: false,
      featureKeys: [
        'landing.pricing.featureUnlimitedDoctors',
        'landing.pricing.featureUnlimitedPatients',
        'landing.pricing.featureMultiLocation',
        'landing.pricing.featureAllProfessional',
        'landing.pricing.featureCustomIntegrations',
        'landing.pricing.featureAPI',
        'landing.pricing.featureDedicatedManager',
        'landing.pricing.featureOnSiteTraining',
        'landing.pricing.featureSLA',
        'landing.pricing.featureWhiteLabel',
      ],
      limitationKeys: [],
      ctaKey: 'landing.pricing.contactSales',
      ctaStyle: 'secondary',
    },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-teal-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200/20 to-teal-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-primary-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 text-primary-700 font-medium text-sm mb-4">
            {t('landing.pricing.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('landing.pricing.title')}{' '}
            <span className="bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
              {t('landing.pricing.titleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('landing.pricing.description')}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white rounded-full p-1.5 shadow-soft border border-gray-100">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isAnnual
                  ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('landing.pricing.monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isAnnual
                  ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t('landing.pricing.annual')}
              <span className={`text-xs px-2 py-0.5 rounded-full ${isAnnual ? 'bg-white/20' : 'bg-green-100 text-green-700'}`}>
                {t('landing.pricing.save20')}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.nameKey}
              className={`relative bg-white rounded-2xl p-8 border transition-all duration-500 hover:-translate-y-2 ${
                plan.popular
                  ? 'border-primary-200 shadow-soft-xl scale-105 z-10'
                  : 'border-gray-100 shadow-soft hover:shadow-soft-xl'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white text-sm font-semibold shadow-glow">
                    {t('landing.pricing.mostPopular')}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  plan.popular
                    ? 'bg-gradient-to-br from-primary-500 to-teal-500'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{t(plan.nameKey)}</h3>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6">{t(plan.descriptionKey)}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-gray-500">{t('landing.pricing.perMonth')}</span>
                  )}
                </div>
                {plan.monthlyPrice > 0 && isAnnual && (
                  <p className="text-sm text-gray-500 mt-1">
                    {t('landing.pricing.billedAnnually')} (${plan.annualPrice * 12}/year)
                  </p>
                )}
                {plan.monthlyPrice === 0 && (
                  <p className="text-sm text-gray-500 mt-1">{t('landing.pricing.freeForever')}</p>
                )}
              </div>

              {/* CTA Button */}
              <a
                href="#cta"
                onClick={(e) => scrollToSection(e, '#cta')}
                className={`block w-full text-center py-3 px-6 rounded-full font-semibold transition-all duration-300 mb-8 ${
                  plan.ctaStyle === 'primary'
                    ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white shadow-glow hover:shadow-glow-teal hover:scale-105'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {t(plan.ctaKey)}
              </a>

              {/* Features List */}
              <div className="space-y-3">
                {plan.featureKeys.map((featureKey) => (
                  <div key={featureKey} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{t(featureKey)}</span>
                  </div>
                ))}
                {plan.limitationKeys.map((limitationKey) => (
                  <div key={limitationKey} className="flex items-start gap-3 opacity-50">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-0.5 bg-gray-400 rounded" />
                    </div>
                    <span className="text-gray-500 text-sm">{t(limitationKey)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            {t('landing.pricing.trustBadge')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

