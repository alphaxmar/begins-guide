
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import SocialProofSection from "@/components/homepage/SocialProofSection";
import FeaturedCoursesSection from "@/components/homepage/FeaturedCoursesSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import FeaturedArticlesSection from "@/components/homepage/FeaturedArticlesSection";
import FinalCTASection from "@/components/homepage/FinalCTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SocialProofSection />
        <FeaturedCoursesSection />
        <div className="container mx-auto px-4 py-12">
          <TestimonialsSection />
          <FeaturedArticlesSection />
        </div>
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
