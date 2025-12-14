import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import BenefitsSection from './components/BenefitsSection';
import ScreenshotsSection from './components/ScreenshotsSection';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Fixed Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main>
        {/* Hero - Above the fold */}
        <HeroSection />
        
        {/* Features - What we offer */}
        <FeaturesSection />
        
        {/* How It Works - Process explanation */}
        <HowItWorksSection />
        
        {/* Benefits - Why choose us */}
        <BenefitsSection />
        
        {/* Screenshots - Product preview */}
        <ScreenshotsSection />
        
        {/* Pricing - Plans and pricing */}
        <PricingSection />
        
        {/* Testimonials - Social proof */}
        <TestimonialsSection />
        
        {/* FAQ - Common questions */}
        <FAQSection />
        
        {/* Final CTA - Conversion section */}
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
