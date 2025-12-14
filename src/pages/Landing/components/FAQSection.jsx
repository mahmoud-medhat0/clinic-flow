import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from '../../../context/DirectionContext';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useTranslation();

  const faqs = [
    { questionKey: 'landing.faq.q1', answerKey: 'landing.faq.a1' },
    { questionKey: 'landing.faq.q2', answerKey: 'landing.faq.a2' },
    { questionKey: 'landing.faq.q3', answerKey: 'landing.faq.a3' },
    { questionKey: 'landing.faq.q4', answerKey: 'landing.faq.a4' },
    { questionKey: 'landing.faq.q5', answerKey: 'landing.faq.a5' },
    { questionKey: 'landing.faq.q6', answerKey: 'landing.faq.a6' },
    { questionKey: 'landing.faq.q7', answerKey: 'landing.faq.a7' },
  ];

  return (
    <section id="faq" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-primary-50/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary-200/20 to-teal-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-teal-200/20 to-primary-200/20 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 text-primary-700 font-medium text-sm mb-4">
            {t('landing.faq.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('landing.faq.title')}{' '}
            <span className="bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
              {t('landing.faq.titleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            {t('landing.faq.description')}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? 'border-primary-200 shadow-soft-lg'
                  : 'border-gray-100 shadow-soft hover:shadow-soft-lg'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    openIndex === index
                      ? 'bg-gradient-to-br from-primary-500 to-teal-500'
                      : 'bg-gray-100'
                  }`}>
                    <HelpCircle className={`w-5 h-5 ${openIndex === index ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {t(faq.questionKey)}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pl-20">
                  <p className="text-gray-600 leading-relaxed">
                    {t(faq.answerKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">{t('landing.faq.stillHaveQuestions')}</p>
          <a
            href="mailto:support@clinicflow.com"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            {t('landing.faq.contactSupport')}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

