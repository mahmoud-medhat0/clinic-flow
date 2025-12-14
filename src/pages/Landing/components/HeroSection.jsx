import React from 'react';
import { Play, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';

const HeroSection = () => {
  const { t } = useTranslation();

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-teal-50/40">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/40 to-teal-200/40 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-gradient-to-br from-teal-200/30 to-primary-200/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-br from-primary-300/20 to-teal-300/20 rounded-full blur-2xl animate-float" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb15_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 text-primary-700 font-medium text-sm mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>{t('landing.hero.badge')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t('landing.hero.title1')}{' '}
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-teal-500 bg-clip-text text-transparent">
                {t('landing.hero.title2')}
              </span>
            </h1>

            {/* Value Proposition */}
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              {t('landing.hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <a
                href="#cta"
                onClick={(e) => scrollToSection(e, '#cta')}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold text-lg shadow-glow hover:shadow-glow-teal hover:scale-105 transition-all duration-300"
              >
                {t('landing.hero.startFreeTrial')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-gray-700 font-semibold text-lg shadow-soft-lg hover:shadow-soft-xl hover:scale-105 border border-gray-200 transition-all duration-300"
              >
                <Play className="w-5 h-5 text-primary-500" />
                {t('landing.hero.bookDemo')}
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
                <span>{t('landing.hero.noCreditCard')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
                <span>{t('landing.hero.freeTrial14')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
                <span>{t('landing.hero.cancelAnytime')}</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-soft-xl border border-gray-100 bg-white">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                  {/* Mock Dashboard UI */}
                  <div className="bg-white rounded-xl shadow-soft p-4 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100" />
                        <div className="w-8 h-8 rounded-full bg-gray-100" />
                      </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-primary-50 rounded-lg p-3">
                        <div className="h-3 w-8 bg-primary-200 rounded mb-2" />
                        <div className="h-6 w-12 bg-primary-400 rounded" />
                      </div>
                      <div className="bg-teal-50 rounded-lg p-3">
                        <div className="h-3 w-8 bg-teal-200 rounded mb-2" />
                        <div className="h-6 w-12 bg-teal-400 rounded" />
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="h-3 w-8 bg-green-200 rounded mb-2" />
                        <div className="h-6 w-12 bg-green-400 rounded" />
                      </div>
                    </div>
                    
                    {/* Calendar Preview */}
                    <div className="bg-gray-50 rounded-lg p-3 h-32">
                      <div className="flex justify-between mb-2">
                        <div className="h-3 w-16 bg-gray-200 rounded" />
                        <div className="h-3 w-12 bg-gray-200 rounded" />
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {[...Array(14)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-4 rounded ${
                              i === 3 || i === 8
                                ? 'bg-primary-400'
                                : i === 5 || i === 11
                                ? 'bg-teal-400'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-soft-lg p-3 border border-gray-100 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">{t('landing.hero.newAppointment')}</div>
                    <div className="text-sm font-semibold text-gray-800">Dr. Sarah - 2:00 PM</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-soft-lg p-3 border border-gray-100 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">+25%</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">{t('landing.hero.revenueGrowth')}</div>
                    <div className="text-sm font-semibold text-gray-800">{t('landing.hero.thisMonth')}</div>
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

export default HeroSection;

