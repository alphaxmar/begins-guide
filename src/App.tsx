
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserProtectedRoute from "@/components/UserProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import ModernCoursePage from "./pages/ModernCoursePage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import NotFound from "./pages/NotFound";

// User protected pages
import ProfilePage from "./pages/ProfilePage";
import VipCoursesPage from "./pages/VipCoursesPage";
import VipTemplatesPage from "./pages/VipTemplatesPage";

// Admin pages
import DashboardPage from "./pages/admin/DashboardPage";
import AdminArticlesPage from "./pages/admin/AdminArticlesPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminEmailPage from "./pages/admin/AdminEmailPage";
import AdminPaymentSettingsPage from "./pages/admin/AdminPaymentSettingsPage";
import VipPackagesPage from "./pages/admin/VipPackagesPage";
import DiscountCodesPage from "./pages/admin/DiscountCodesPage";
import CreateProductPage from "./pages/admin/CreateProductPage";
import EditProductPage from "./pages/admin/EditProductPage";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import ManageLessonsPage from "./pages/admin/ManageLessonsPage";
import ImportArticlesPage from "./pages/admin/ImportArticlesPage";
import ImportProductsPage from "./pages/admin/ImportProductsPage";
import VipManagementPage from "./pages/admin/VipManagementPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* Public routes with layout */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="articles" element={<Articles />} />
                  <Route path="articles/:slug" element={<ArticleDetail />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:slug" element={<ProductDetail />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="courses/:slug" element={<CoursePage />} />
                  <Route path="learn/:slug" element={<ModernCoursePage />} />
                  <Route path="auth" element={<AuthPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />
                  <Route path="update-password" element={<UpdatePasswordPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="checkout/success" element={<CheckoutSuccessPage />} />
                  
                  {/* User protected routes */}
                  <Route path="profile" element={
                    <UserProtectedRoute>
                      <ProfilePage />
                    </UserProtectedRoute>
                  } />
                  <Route path="vip/courses" element={
                    <UserProtectedRoute>
                      <VipCoursesPage />
                    </UserProtectedRoute>
                  } />
                  <Route path="vip/templates" element={
                    <UserProtectedRoute>
                      <VipTemplatesPage />
                    </UserProtectedRoute>
                  } />
                </Route>

                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardPage />} />
                  <Route path="articles" element={<AdminArticlesPage />} />
                  <Route path="articles/create" element={<CreateArticle />} />
                  <Route path="articles/:id/edit" element={<EditArticle />} />
                  <Route path="articles/import" element={<ImportArticlesPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/create" element={<CreateProductPage />} />
                  <Route path="products/:id/edit" element={<EditProductPage />} />
                  <Route path="products/:id/lessons" element={<ManageLessonsPage />} />
                  <Route path="products/import" element={<ImportProductsPage />} />
                  <Route path="vip-packages" element={<VipPackagesPage />} />
                  <Route path="discount-codes" element={<DiscountCodesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="reports" element={<AdminReportsPage />} />
                  <Route path="email" element={<AdminEmailPage />} />
                  <Route path="payment-settings" element={<AdminPaymentSettingsPage />} />
                  <Route path="vip-management" element={<VipManagementPage />} />
                </Route>

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
