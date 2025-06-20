
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Import pages
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";
import ProfilePage from "@/pages/ProfilePage";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CoursePage from "@/pages/CoursePage";
import CoursesPage from "@/pages/CoursesPage";
import NotFound from "@/pages/NotFound";

// Admin pages
import ProtectedRoute from "@/components/ProtectedRoute";
import UserProtectedRoute from "@/components/UserProtectedRoute";
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
import AdminUsersPage from "@/pages/admin/AdminUsersPage";

// Layout
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCartButton from "@/components/FloatingCartButton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto px-4">
                  <ErrorBoundary>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/update-password" element={<UpdatePasswordPage />} />
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/articles/:slug" element={<ArticleDetail />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:slug" element={<ProductDetail />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/courses" element={<CoursesPage />} />

                      {/* User protected routes */}
                      <Route path="/profile" element={<UserProtectedRoute><ProfilePage /></UserProtectedRoute>} />
                      <Route path="/checkout" element={<UserProtectedRoute><CheckoutPage /></UserProtectedRoute>} />
                      <Route path="/courses/:slug/learn" element={<UserProtectedRoute><CoursePage /></UserProtectedRoute>} />

                      {/* Admin routes */}
                      <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                      <Route path="/admin/products" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
                      <Route path="/admin/products/new" element={<ProtectedRoute><CreateProductPage /></ProtectedRoute>} />
                      <Route path="/admin/products/:slug/edit" element={<ProtectedRoute><EditProductPage /></ProtectedRoute>} />
                      <Route path="/admin/products/:slug/lessons" element={<ProtectedRoute><ManageLessonsPage /></ProtectedRoute>} />
                      <Route path="/admin/products/import" element={<ProtectedRoute><ImportProductsPage /></ProtectedRoute>} />
                      <Route path="/admin/articles" element={<ProtectedRoute><AdminArticlesPage /></ProtectedRoute>} />
                      <Route path="/admin/articles/new" element={<ProtectedRoute><CreateArticle /></ProtectedRoute>} />
                      <Route path="/admin/articles/:id/edit" element={<ProtectedRoute><EditArticle /></ProtectedRoute>} />
                      <Route path="/admin/articles/import" element={<ProtectedRoute><ImportArticlesPage /></ProtectedRoute>} />
                      <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </main>
                <Footer />
                <FloatingCartButton />
              </div>
              <Toaster />
            </Router>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
