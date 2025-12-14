import React, { useState, useEffect, useRef } from 'react';
import { Clock, TrendingUp, UserCheck, Zap, Shield, HeartPulse } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';

const BenefitsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Clock,
      value: 10,
      suffix: '+',
      unitKey: 'landing.benefits.stat1Unit',
      labelKey: 'landing.benefits.stat1Label',
      descriptionKey: 'landing.benefits.stat1Desc',
    },
    {
      icon: TrendingUp,
      value: 25,
      suffix: '%',
      unitKey: '',
      labelKey: 'landing.benefits.stat2Label',
      descriptionKey: 'landing.benefits.stat2Desc',
    },
    {
      icon: UserCheck,
      value: 40,
      suffix: '%',
      unitKey: '',
      labelKey: 'landing.benefits.stat3Label',
      descriptionKey: 'landing.benefits.stat3Desc',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      titleKey: 'landing.benefits.lightningFast',
      descriptionKey: 'landing.benefits.lightningFastDesc',
    },
    {
      icon: Shield,
      titleKey: 'landing.benefits.hipaaCompliant',
      descriptionKey: 'landing.benefits.hipaaCompliantDesc',
    },
    {
      icon: HeartPulse,
      titleKey: 'landing.benefits.madeForHealthcare',
      descriptionKey: 'landing.benefits.madeForHealthcareDesc',
    },
  ];

  const AnimatedNumber = ({ value, suffix, isVisible }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;
      
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
      <span className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
        {count}{suffix}
      </span>
    );
  };

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-gradient-to-br from-primary-900 via-primary-800 to-teal-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-teal-300 font-medium text-sm mb-4 backdrop-blur-sm">
            {t('landing.benefits.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('landing.benefits.title')}{' '}
            <span className="bg-gradient-to-r from-teal-400 to-primary-400 bg-clip-text text-transparent">
              {t('landing.benefits.titleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-primary-100/80">
            {t('landing.benefits.description')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.labelKey}
              className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-500 group"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6 text-teal-400" />
              </div>

              {/* Number */}
              <div className="mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                {stat.unitKey && (
                  <span className="text-2xl font-semibold text-white ml-1">{t(stat.unitKey)}</span>
                )}
              </div>

              {/* Label */}
              <h3 className="text-xl font-semibold text-white mb-2">{t(stat.labelKey)}</h3>
              <p className="text-primary-100/70">{t(stat.descriptionKey)}</p>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.titleKey}
              className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-primary-500/20 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">{t(benefit.titleKey)}</h4>
                <p className="text-sm text-primary-100/70">{t(benefit.descriptionKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
