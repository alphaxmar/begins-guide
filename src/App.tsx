
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CheckoutSuccessPage from "@/pages/CheckoutSuccessPage";
import ProfilePage from "@/pages/ProfilePage";
import CoursePage from "@/pages/CoursePage";
import CoursesPage from "@/pages/CoursesPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";
import NotFound from "@/pages/NotFound";

// Admin Pages
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardPage from "@/pages/admin/DashboardPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import CreateProductPage from "@/pages/admin/CreateProductPage";
import EditProductPage from "@/pages/admin/EditProductPage";
import ManageLessonsPage from "@/pages/admin/ManageLessonsPage";
import AdminArticlesPage from "@/pages/admin/AdminArticlesPage";
import CreateArticle from "@/pages/CreateArticle";
import EditArticle from "@/pages/EditArticle";
import ImportProductsPage from "@/pages/admin/ImportProductsPage";
import ImportArticlesPage from "@/pages/admin/ImportArticlesPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminEmailPage from "@/pages/admin/AdminEmailPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/update-password" element={<UpdatePasswordPage />} />
                
                {/* Articles */}
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:slug" element={<ArticleDetail />} />
                
                {/* Products */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                
                {/* Shopping */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
                
                {/* User */}
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Courses */}
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:slug/learn" element={<CoursePage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly>
                    <DashboardPage />
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
                <Route path="/admin/products/:id/lessons" element={
                  <ProtectedRoute adminOnly>
                    <ManageLessonsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/articles" element={
                  <ProtectedRoute adminOnly>
                    <AdminArticlesPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/articles/create" element={
                  <ProtectedRoute adminOnly>
                    <CreateArticle />
                  </ProtectedRoute>
                } />
                <Route path="/admin/articles/:id/edit" element={
                  <ProtectedRoute adminOnly>
                    <EditArticle />
                  </ProtectedRoute>
                } />
                <Route path="/admin/import/products" element={
                  <ProtectedRoute adminOnly>
                    <ImportProductsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/import/articles" element={
                  <ProtectedRoute adminOnly>
                    <ImportArticlesPage />
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
                <Route path="/admin/email" element={
                  <ProtectedRoute adminOnly>
                    <AdminEmailPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute adminOnly>
                    <AdminReportsPage />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <Toaster />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
