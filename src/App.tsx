
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import CreateArticle from "@/pages/CreateArticle";
import EditArticle from "@/pages/EditArticle";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import CoursePage from "@/pages/CoursePage";
import CoursesPage from "@/pages/CoursesPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import NotFound from "@/pages/NotFound";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";

// Admin pages
import DashboardPage from "@/pages/admin/DashboardPage";
import AdminArticlesPage from "@/pages/admin/AdminArticlesPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import CreateProductPage from "@/pages/admin/CreateProductPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import ManageLessonsPage from "@/pages/admin/ManageLessonsPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminEmailPage from "@/pages/admin/AdminEmailPage";
import ImportArticlesPage from "@/pages/admin/ImportArticlesPage";
import ImportProductsPage from "@/pages/admin/ImportProductsPage";

// Protected Route Components
import UserProtectedRoute from "@/components/UserProtectedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="auth" element={<AuthPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />
                  <Route path="update-password" element={<UpdatePasswordPage />} />
                  
                  {/* User Protected Routes */}
                  <Route path="profile" element={
                    <UserProtectedRoute>
                      <ProfilePage />
                    </UserProtectedRoute>
                  } />
                  
                  {/* Public Routes */}
                  <Route path="articles" element={<Articles />} />
                  <Route path="articles/:slug" element={<ArticleDetail />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:slug" element={<ProductDetail />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="courses/:slug" element={<CoursePage />} />
                  <Route path="courses/:slug/learn" element={
                    <UserProtectedRoute>
                      <CoursePage />
                    </UserProtectedRoute>
                  } />
                  
                  {/* Cart and Checkout */}
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="checkout-success" element={<CheckoutSuccessPage />} />
                  
                  {/* Admin Protected Routes */}
                  <Route path="admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/articles" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminArticlesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/articles/create" element={
                    <ProtectedRoute adminOnly={true}>
                      <CreateArticle />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/articles/:id/edit" element={
                    <ProtectedRoute adminOnly={true}>
                      <EditArticle />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/products" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminProductsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/products/create" element={
                    <ProtectedRoute adminOnly={true}>
                      <CreateProductPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/products/:id/edit" element={
                    <ProtectedRoute adminOnly={true}>
                      <EditProductPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/products/:id/lessons" element={
                    <ProtectedRoute adminOnly={true}>
                      <ManageLessonsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/orders" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminOrdersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/users" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/reports" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminReportsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/email" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminEmailPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/import/articles" element={
                    <ProtectedRoute adminOnly={true}>
                      <ImportArticlesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin/import/products" element={
                    <ProtectedRoute adminOnly={true}>
                      <ImportProductsPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
