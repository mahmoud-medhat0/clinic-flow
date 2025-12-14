import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Mail } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';

const CTASection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
    }
  };

  return (
    <section id="cta" className="py-20 lg:py-32 bg-gradient-to-br from-primary-600 via-primary-700 to-teal-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border border-white/10 rounded-2xl rotate-12 animate-float" />
      <div className="absolute bottom-20 right-10 w-16 h-16 border border-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/5 rounded-xl rotate-45 animate-float" style={{ animationDelay: '0.5s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          <span>{t('landing.cta.badge')}</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
          {t('landing.cta.title')}{' '}
          <span className="bg-gradient-to-r from-teal-300 to-primary-300 bg-clip-text text-transparent">
            {t('landing.cta.titleHighlight')}
          </span>
        </h2>

        <p className="text-lg lg:text-xl text-primary-100/90 mb-10 max-w-2xl mx-auto">
          {t('landing.cta.description')}
        </p>

        {/* Email Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('landing.cta.enterEmail')}
                  className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-soft-xl"
                  required
                />
              </div>
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 text-gray-900 font-semibold shadow-glow-teal hover:scale-105 transition-all duration-300"
              >
                {t('landing.cta.startFreeTrial')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-center gap-3 text-white">
              <CheckCircle2 className="w-8 h-8 text-teal-300" />
              <div className="text-left">
                <p className="font-semibold">{t('landing.cta.welcomeAboard')}</p>
                <p className="text-sm text-primary-100">{t('landing.cta.checkEmail')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-100/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-300" />
            <span>{t('landing.cta.setupIn2Min')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-300" />
            <span>{t('landing.cta.cancelAnytime')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-300" />
            <span>{t('landing.cta.support247')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

