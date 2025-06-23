
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import SocialProofSection from "@/components/homepage/SocialProofSection";
import TriageHubSection from "@/components/homepage/TriageHubSection";
import FeaturedProgramSection from "@/components/homepage/FeaturedProgramSection";
import AIToolsSection from "@/components/homepage/AIToolsSection";
import FeaturedArticlesSection from "@/components/homepage/FeaturedArticlesSection";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import FinalCTASection from "@/components/homepage/FinalCTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SocialProofSection />
        <div className="container mx-auto px-4 py-12">
          <TriageHubSection />
          <FeaturedProgramSection />
          <AIToolsSection />
          <FeaturedArticlesSection />
          <TestimonialsSection />
        </div>
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
