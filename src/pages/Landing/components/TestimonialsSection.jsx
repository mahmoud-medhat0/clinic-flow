import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Dr. Sarah Ahmed',
      role: 'Family Medicine',
      clinic: 'Ahmed Family Clinic',
      image: null,
      rating: 5,
      quote: "ClinicFlow has transformed how I manage my practice. I've reduced no-shows by 45% and patient satisfaction has never been higher. The automated reminders alone have paid for the subscription many times over.",
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Pediatrician',
      clinic: 'Little Stars Pediatrics',
      image: null,
      rating: 5,
      quote: "As a busy pediatrician with hundreds of young patients, I needed a system that was fast and reliable. ClinicFlow delivers on both fronts. The intuitive interface means my staff learned it in hours, not days.",
    },
    {
      name: 'Dr. Fatima Al-Hassan',
      role: 'Dermatologist',
      clinic: 'Glow Skin Center',
      image: null,
      rating: 5,
      quote: "The billing feature is a game-changer. What used to take hours now takes minutes. My revenue has increased 30% since switching to ClinicFlow, and I finally have time to focus on patient care.",
    },
  ];

  const stats = [
    { value: '2,000+', label: 'Happy Clinics' },
    { value: '500,000+', label: 'Patients Served' },
    { value: '4.9/5', label: 'Average Rating' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-primary-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-100/50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-teal-100 text-primary-700 font-medium text-sm mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Loved by{' '}
            <span className="bg-gradient-to-r from-primary-600 to-teal-600 bg-clip-text text-transparent">
              doctors worldwide
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it. Here's what healthcare professionals say about ClinicFlow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-100 shadow-soft hover:shadow-soft-xl transition-all duration-500 group"
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
              <p className="text-gray-600 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-xs text-primary-600">{testimonial.clinic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-teal-500 rounded-2xl p-8 lg:p-12 shadow-glow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100 text-sm lg:text-base">
                  {stat.label}
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
