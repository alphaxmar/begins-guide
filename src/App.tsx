import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/pages/AuthPage';
import HomePage from '@/pages/HomePage';
import PricingPage from '@/pages/PricingPage';
import ProfilePage from '@/pages/ProfilePage';
import ContactPage from '@/pages/ContactPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProtectedRoute from '@/components/UserProtectedRoute';
import AdminLayout from '@/layouts/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminArticlesPage from '@/pages/admin/AdminArticlesPage';
import AdminDiscountCodesPage from '@/pages/admin/AdminDiscountCodesPage';
import AdminPaymentSettingsPage from '@/pages/admin/AdminPaymentSettingsPage';
import AdminEmailTemplatesPage from '@/pages/admin/AdminEmailTemplatesPage';
import ProMembershipsPage from '@/pages/admin/ProMembershipsPage';
import ProPackagesPage from '@/pages/admin/ProPackagesPage';

function App() {
  const { initializeAuth, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Redirect to profile if logged in and on /auth
  if (user && location.pathname === '/auth') {
    return <Navigate to="/profile" replace />;
  }

  return (
    
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        
        {/* User Routes */}
        <Route path="/profile" element={<UserProtectedRoute><ProfilePage /></UserProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="discount-codes" element={<AdminDiscountCodesPage />} />
          <Route path="payment-settings" element={<AdminPaymentSettingsPage />} />
          <Route path="email-templates" element={<AdminEmailTemplatesPage />} />
          
          {/* Updated PRO routes */}
          <Route path="pro-memberships" element={<ProMembershipsPage />} />
          <Route path="pro-packages" element={<ProPackagesPage />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="vip-management" element={<Navigate to="/admin/pro-memberships" replace />} />
          <Route path="vip-packages" element={<Navigate to="/admin/pro-packages" replace />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    
  );
}

export default App;
