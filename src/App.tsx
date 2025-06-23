import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/pages/AuthPage';
import Index from '@/pages/Index';
import Articles from '@/pages/Articles';
import ArticleDetail from '@/pages/ArticleDetail';
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
      <Route path="/articles/:slug" element={<ArticleDetail />} />
      
      {/* Other pages */}
      <Route path="/pro" element={<ProPage />} />
      <Route path="/program" element={<ProgramPage />} />
      <Route path="/micro-saas-course" element={<MicroSaasCoursePage />} />
      <Route path="/services/mvp-launchpad" element={<MvpLaunchpadPage />} />
      <Route path="/no-code-webpreneur" element={<NoCodeWebpreneurPage />} />
      
      {/* Existing pages */}
      <Route path="/pricing" element={<PricingPage />} />
      
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
