import React from 'react';
import { UserPlus, CalendarClock, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';

const HowItWorksSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      icon: UserPlus,
      titleKey: 'landing.howItWorks.step1Title',
      descriptionKey: 'landing.howItWorks.step1Desc',
      featureKeys: ['landing.howItWorks.step1Feature1', 'landing.howItWorks.step1Feature2', 'landing.howItWorks.step1Feature3'],
    },
    {
      number: '02',
      icon: CalendarClock,
      titleKey: 'landing.howItWorks.step2Title',
      descriptionKey: 'landing.howItWorks.step2Desc',
      featureKeys: ['landing.howItWorks.step2Feature1', 'landing.howItWorks.step2Feature2', 'landing.howItWorks.step2Feature3'],
    },
    {
      number: '03',
      icon: TrendingUp,
      titleKey: 'landing.howItWorks.step3Title',
      descriptionKey: 'landing.howItWorks.step3Desc',
      featureKeys: ['landing.howItWorks.step3Feature1', 'landing.howItWorks.step3Feature2', 'landing.howItWorks.step3Feature3'],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-br from-primary-200/20 to-teal-200/20 dark:from-primary-600/10 dark:to-teal-600/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-primary-200/20 dark:from-teal-600/10 dark:to-primary-600/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-100 to-primary-100 dark:from-teal-900/50 dark:to-primary-900/50 text-teal-700 dark:text-teal-300 font-medium text-sm mb-4">
            {t('landing.howItWorks.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('landing.howItWorks.title')}{' '}
            <span className="bg-gradient-to-r from-teal-600 to-primary-600 bg-clip-text text-transparent">
              {t('landing.howItWorks.titleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('landing.howItWorks.description')}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-primary-200 via-teal-200 to-primary-200 dark:from-primary-700 dark:via-teal-700 dark:to-primary-700" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-soft-lg border border-gray-100 dark:border-gray-700 hover:shadow-soft-xl transition-all duration-500 h-full">
                  {/* Step Number Circle */}
                  <div className="absolute -top-6 left-8 lg:left-1/2 lg:-translate-x-1/2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-glow">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-6 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/30 dark:to-teal-900/30 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {t(step.descriptionKey)}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {step.featureKeys.map((featureKey) => (
                      <li key={featureKey} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        {t(featureKey)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow (Mobile) */}
                {index < 2 && (
                  <div className="flex justify-center py-4 md:hidden">
                    <ArrowRight className="w-6 h-6 text-primary-300 dark:text-primary-600 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
