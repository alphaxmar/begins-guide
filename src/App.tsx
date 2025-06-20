
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import CoursePage from "@/pages/CoursePage";
import CoursesPage from "@/pages/CoursesPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AuthPage from "@/pages/AuthPage";
import ProfilePage from "@/pages/ProfilePage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";
import NotFound from "@/pages/NotFound";

// Admin Pages
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardPage from "@/pages/admin/DashboardPage";
import AdminArticlesPage from "@/pages/admin/AdminArticlesPage";
import CreateArticle from "@/pages/CreateArticle";
import EditArticle from "@/pages/EditArticle";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import CreateProductPage from "@/pages/admin/CreateProductPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import ManageLessonsPage from "@/pages/admin/ManageLessonsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import ImportArticlesPage from "@/pages/admin/ImportArticlesPage";
import ImportProductsPage from "@/pages/admin/ImportProductsPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminEmailPage from "@/pages/admin/AdminEmailPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="articles" element={<Articles />} />
                    <Route path="articles/:slug" element={<ArticleDetail />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/:slug" element={<ProductDetail />} />
                    <Route path="courses" element={<CoursesPage />} />
                    <Route path="courses/:slug" element={<CoursePage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="auth" element={<AuthPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                    <Route path="update-password" element={<UpdatePasswordPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="admin/articles" element={<ProtectedRoute><AdminArticlesPage /></ProtectedRoute>} />
                    <Route path="admin/articles/create" element={<ProtectedRoute><CreateArticle /></ProtectedRoute>} />
                    <Route path="admin/articles/:id/edit" element={<ProtectedRoute><EditArticle /></ProtectedRoute>} />
                    <Route path="admin/articles/import" element={<ProtectedRoute><ImportArticlesPage /></ProtectedRoute>} />
                    
                    <Route path="admin/products" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
                    <Route path="admin/products/create" element={<ProtectedRoute><CreateProductPage /></ProtectedRoute>} />
                    <Route path="admin/products/:id/edit" element={<ProtectedRoute><EditProductPage /></ProtectedRoute>} />
                    <Route path="admin/products/:id/lessons" element={<ProtectedRoute><ManageLessonsPage /></ProtectedRoute>} />
                    <Route path="admin/products/import" element={<ProtectedRoute><ImportProductsPage /></ProtectedRoute>} />
                    
                    <Route path="admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
                    <Route path="admin/orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
                    <Route path="admin/email" element={<ProtectedRoute><AdminEmailPage /></ProtectedRoute>} />
                    <Route path="admin/reports" element={<ProtectedRoute><AdminReportsPage /></ProtectedRoute>} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
