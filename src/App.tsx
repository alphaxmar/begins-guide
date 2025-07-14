
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/pages/AuthPage';
import Index from '@/pages/Index';
import Articles from '@/pages/Articles';
import ArticleDetail from '@/pages/ArticleDetail';
import MicroSaasIdeasArticle from '@/pages/MicroSaasIdeasArticle';
import OrganicMarketingArticle from '@/pages/OrganicMarketingArticle';
import NoCodeBusinessArticle from '@/pages/NoCodeBusinessArticle';
import PricingDigitalProductsArticle from '@/pages/PricingDigitalProductsArticle';
import ProPage from '@/pages/ProPage';
import ProgramPage from '@/pages/ProgramPage';
import MicroSaasCoursePage from '@/pages/MicroSaasCoursePage';
import MvpLaunchpadPage from '@/pages/MvpLaunchpadPage';
import NoCodeWebpreneurPage from '@/pages/NoCodeWebpreneurPage';
import PricingPage from '@/pages/PricingPage';
import ProfilePage from '@/pages/ProfilePage';
import CohortPage from '@/pages/CohortPage';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProtectedRoute from '@/components/UserProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminArticlesPage from '@/pages/admin/AdminArticlesPage';
import DiscountCodesPage from '@/pages/admin/DiscountCodesPage';
import AdminPaymentSettingsPage from '@/pages/admin/AdminPaymentSettingsPage';
import AdminEmailPage from '@/pages/admin/AdminEmailPage';
import ProMembershipsPage from '@/pages/admin/ProMembershipsPage';
import ProPackagesPage from '@/pages/admin/ProPackagesPage';
import AiToolsForEntrepreneursArticle from '@/pages/AiToolsForEntrepreneursArticle';
import HealjaiCaseStudyArticle from '@/pages/HealjaiCaseStudyArticle';
import CaseStudyBuildSellplanStoreArticle from '@/pages/CaseStudyBuildSellplanStoreArticle';
import CaseStudyAiFranchiseFinderArticle from '@/pages/CaseStudyAiFranchiseFinderArticle';
import CaseStudyNocodeBookingAppArticle from '@/pages/CaseStudyNocodeBookingAppArticle';
import Seo101ForBusyOwnersArticle from '@/pages/Seo101ForBusyOwnersArticle';
import BasicTaxForThaiBusinessOwnersArticle from '@/pages/BasicTaxForThaiBusinessOwnersArticle';
import OfficeWorkerTo6FigureFashionBrandArticle from '@/pages/OfficeWorkerTo6FigureFashionBrandArticle';
import WhyPersonalBrandingIsPowerfulArticle from '@/pages/WhyPersonalBrandingIsPowerfulArticle';
import LovableReviewArticle from '@/pages/LovableReviewArticle';
import HowToBuildOnlineCommunityArticle from '@/pages/HowToBuildOnlineCommunityArticle';
import HowToBuildCoursePlatformArticle from '@/pages/HowToBuildCoursePlatformArticle';
import CourseSalesPage from '@/pages/CourseSalesPage';
import CheckoutPage from '@/pages/CheckoutPage';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import CartPage from '@/pages/CartPage';
import Products from '@/pages/Products';
import CoursePage from '@/pages/CoursePage';
import ModernCoursePage from '@/pages/ModernCoursePage';

function App() {
  const { user } = useAuth();
  const location = useLocation();

  // Redirect to profile if logged in and on /auth
  if (user && location.pathname === '/auth') {
    return <Navigate to="/profile" replace />;
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Index />} />
      
      {/* Articles routes */}
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/10-thai-micro-saas-ideas-2025" element={<MicroSaasIdeasArticle />} />
      <Route path="/articles/how-to-get-first-100-customers-organic-marketing" element={<OrganicMarketingArticle />} />
      <Route path="/articles/what-is-no-code-business-the-whole-truth" element={<NoCodeBusinessArticle />} />
      <Route path="/articles/how-to-price-digital-products-4-strategies" element={<PricingDigitalProductsArticle />} />
      <Route path="/articles/5-ai-tools-for-entrepreneurs-2025" element={<AiToolsForEntrepreneursArticle />} />
      <Route path="/articles/case-study-healjai-me-matching-platform-15-days" element={<HealjaiCaseStudyArticle />} />
      <Route path="/articles/case-study-build-sellplan-store-in-7-days-with-nocode" element={<CaseStudyBuildSellplanStoreArticle />} />
      <Route path="/articles/case-study-ai-franchise-finder-no-code" element={<CaseStudyAiFranchiseFinderArticle />} />
      <Route path="/articles/case-study-nocode-cafe-booking-app-7-days" element={<CaseStudyNocodeBookingAppArticle />} />
      <Route path="/articles/seo-101-for-busy-business-owners" element={<Seo101ForBusyOwnersArticle />} />
      <Route path="/articles/basic-tax-for-thai-business-owners" element={<BasicTaxForThaiBusinessOwnersArticle />} />
      <Route path="/articles/interview-office-worker-to-6-figure-fashion-brand" element={<OfficeWorkerTo6FigureFashionBrandArticle />} />
      <Route path="/articles/why-personal-branding-is-powerful-for-small-business" element={<WhyPersonalBrandingIsPowerfulArticle />} />
      <Route path="/articles/what-is-lovable-nocode-tool-review" element={<LovableReviewArticle />} />
      <Route path="/articles/how-to-build-online-community-turn-customers-into-fans" element={<HowToBuildOnlineCommunityArticle />} />
      <Route path="/articles/how-to-build-course-platform-with-nocode" element={<HowToBuildCoursePlatformArticle />} />
      <Route path="/articles/:slug" element={<ArticleDetail />} />
      
      {/* Course Sales Pages */}
      <Route path="/course/:slug" element={<CourseSalesPage />} />
      
      {/* Learning Routes */}
      <Route path="/learn/:slug" element={<UserProtectedRoute><CoursePage /></UserProtectedRoute>} />
      
      {/* Other pages */}
      <Route path="/pro" element={<ProPage />} />
      <Route path="/program" element={<ProgramPage />} />
      <Route path="/micro-saas-course" element={<MicroSaasCoursePage />} />
      <Route path="/services/mvp-launchpad" element={<MvpLaunchpadPage />} />
      <Route path="/no-code-webpreneur" element={<NoCodeWebpreneurPage />} />
      
      {/* Existing pages */}
      <Route path="/products" element={<Products />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
      
      {/* User Routes */}
      <Route path="/profile" element={<UserProtectedRoute><ProfilePage /></UserProtectedRoute>} />

      {/* Cohort Routes */}
      <Route path="/cohort/:productSlug" element={<UserProtectedRoute><CohortPage /></UserProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="articles" element={<AdminArticlesPage />} />
        <Route path="discount-codes" element={<DiscountCodesPage />} />
        <Route path="payment-settings" element={<AdminPaymentSettingsPage />} />
        <Route path="email-templates" element={<AdminEmailPage />} />
        
        {/* Updated PRO routes */}
        <Route path="pro-memberships" element={<ProMembershipsPage />} />
        <Route path="pro-packages" element={<ProPackagesPage />} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="vip-management" element={<Navigate to="/admin/pro-memberships" replace />} />
        <Route path="vip-packages" element={<Navigate to="/admin/pro-packages" replace />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
