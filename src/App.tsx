import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import CoursePage from "@/pages/CoursePage";
import CoursesPage from "@/pages/CoursesPage";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import CreateArticle from "@/pages/CreateArticle";
import EditArticle from "@/pages/EditArticle";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";
import NotFound from "@/pages/NotFound";

// Admin pages
import DashboardPage from "@/pages/admin/DashboardPage";
import AdminArticlesPage from "@/pages/admin/AdminArticlesPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import CreateProductPage from "@/pages/admin/CreateProductPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import AdminEmailPage from "@/pages/admin/AdminEmailPage";
import AdminPaymentSettingsPage from "@/pages/admin/AdminPaymentSettingsPage";
import ManageLessonsPage from "@/pages/admin/ManageLessonsPage";
import ImportProductsPage from "@/pages/admin/ImportProductsPage";
import ImportArticlesPage from "@/pages/admin/ImportArticlesPage";
import VipManagementPage from "@/pages/admin/VipManagementPage";

// Protected route components
import ProtectedRoute from "@/components/ProtectedRoute";
import UserProtectedRoute from "@/components/UserProtectedRoute";

const queryClient = new QueryClient();

function App() {
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
                  <Route path="articles" element={<Articles />} />
                  <Route path="articles/:slug" element={<ArticleDetail />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:slug" element={<ProductDetail />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="courses/:slug" element={
                    <UserProtectedRoute>
                      <CoursePage />
                    </UserProtectedRoute>
                  } />
                  <Route path="courses/:slug/modern" element={
                    <UserProtectedRoute>
                      <ModernCoursePage />
                    </UserProtectedRoute>
                  } />
                  <Route path="auth" element={<AuthPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />
                  <Route path="update-password" element={<UpdatePasswordPage />} />
                  <Route path="profile" element={
                    <UserProtectedRoute>
                      <ProfilePage />
                    </UserProtectedRoute>
                  } />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={
                    <UserProtectedRoute>
                      <CheckoutPage />
                    </UserProtectedRoute>
                  } />
                  <Route path="checkout/success" element={
                    <UserProtectedRoute>
                      <CheckoutSuccessPage />
                    </UserProtectedRoute>
                  } />
                  <Route path="create-article" element={
                    <ProtectedRoute adminOnly>
                      <CreateArticle />
                    </ProtectedRoute>
                  } />
                  <Route path="edit-article/:id" element={
                    <ProtectedRoute adminOnly>
                      <EditArticle />
                    </ProtectedRoute>
                  } />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/articles" element={
                  <ProtectedRoute adminOnly>
                    <AdminArticlesPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                  <ProtectedRoute adminOnly>
                    <AdminProductsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/products/create" element={
                  <ProtectedRoute adminOnly>
                    <CreateProductPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/products/:id/edit" element={
                  <ProtectedRoute adminOnly>
                    <EditProductPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/products/:slug/lessons" element={
                  <ProtectedRoute adminOnly>
                    <ManageLessonsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute adminOnly>
                    <AdminOrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute adminOnly>
                    <AdminUsersPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/vip" element={
                  <ProtectedRoute adminOnly>
                    <VipManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute adminOnly>
                    <AdminReportsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/email" element={
                  <ProtectedRoute adminOnly>
                    <AdminEmailPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/payment-settings" element={
                  <ProtectedRoute adminOnly>
                    <AdminPaymentSettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/import-products" element={
                  <ProtectedRoute adminOnly>
                    <ImportProductsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/import-articles" element={
                  <ProtectedRoute adminOnly>
                    <ImportArticlesPage />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
