
import React from 'react';
import { Helmet } from 'react-helmet-async';
import NoCodeHeroSection from '@/components/course-sales/NoCodeHeroSection';
import NoCodeOpportunitySection from '@/components/course-sales/NoCodeOpportunitySection';
import NoCodeModulesSection from '@/components/course-sales/NoCodeModulesSection';
import NoCodeTestimonialsSection from '@/components/course-sales/NoCodeTestimonialsSection';
import NoCodePricingSection from '@/components/course-sales/NoCodePricingSection';
import NoCodeFAQSection from '@/components/course-sales/NoCodeFAQSection';
import NoCodeFinalCTASection from '@/components/course-sales/NoCodeFinalCTASection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NoCodeWebpreneurPage = () => {
  return (
    <>
      <Helmet>
        <title>No-Code Webpreneur - สร้างธุรกิจออนไลน์โดยไม่ต้องเขียนโค้ด | Begins.guide</title>
        <meta name="description" content="เรียนรู้การสร้างธุรกิจออนไลน์รายได้ 50,000 บาท/เดือนด้วย No-Code Tools เพียง 90 วัน พร้อมแนวทางที่พิสูจน์แล้ว" />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main>
          <NoCodeHeroSection />
          <NoCodeOpportunitySection />
          <NoCodeModulesSection />
          <NoCodeTestimonialsSection />
          <NoCodePricingSection />
          <NoCodeFAQSection />
          <NoCodeFinalCTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NoCodeWebpreneurPage;
