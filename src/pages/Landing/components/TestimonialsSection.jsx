import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      nameKey: 'landing.testimonials.name1',
      roleKey: 'landing.testimonials.role1',
      clinicKey: 'landing.testimonials.clinic1',
      image: null,
      rating: 5,
      quoteKey: 'landing.testimonials.quote1',
    },
    {
      nameKey: 'landing.testimonials.name2',
      roleKey: 'landing.testimonials.role2',
      clinicKey: 'landing.testimonials.clinic2',
      image: null,
      rating: 5,
      quoteKey: 'landing.testimonials.quote2',
    },
    {
      nameKey: 'landing.testimonials.name3',
      roleKey: 'landing.testimonials.role3',
      clinicKey: 'landing.testimonials.clinic3',
      image: null,
      rating: 5,
      quoteKey: 'landing.testimonials.quote3',
    },
  ];

  const stats = [
    { value: '2,000+', labelKey: 'landing.testimonials.happyClinics' },
    { value: '500,000+', labelKey: 'landing.testimonials.patientsServed' },
    { value: '4.9/5', labelKey: 'landing.testimonials.avgRating' },
    { value: '99.9%', labelKey: 'landing.testimonials.uptime' },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-primary-100/50 dark:bg-primary-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-100/50 dark:bg-teal-600/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 dark:from-primary-900/50 dark:to-teal-900/50 text-primary-700 dark:text-primary-300 font-medium text-sm mb-4">
            {t('landing.testimonials.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('landing.testimonials.title')}{' '}
            <span className="bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
              {t('landing.testimonials.titleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('landing.testimonials.description')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.nameKey}
              className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-soft hover:shadow-soft-xl transition-all duration-500 group"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4 pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 italic">
                "{t(testimonial.quoteKey)}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold text-lg">
                  {t(testimonial.nameKey).split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t(testimonial.nameKey)}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t(testimonial.roleKey)}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400">{t(testimonial.clinicKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-teal-500 rounded-2xl p-8 lg:p-12 shadow-glow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100 text-sm lg:text-base">
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
