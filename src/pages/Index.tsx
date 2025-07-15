
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import ProblemSection from "@/components/homepage/ProblemSection";
import SolutionSection from "@/components/homepage/SolutionSection";
import ValueLadderSection from "@/components/homepage/ValueLadderSection";
import FinalCTASection from "@/components/homepage/FinalCTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ValueLadderSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
