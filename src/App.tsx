
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Articles from "./pages/Articles";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";
import ArticleDetail from "./pages/ArticleDetail";
import ProductDetail from "./pages/ProductDetail";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminArticlesPage from "./pages/admin/AdminArticlesPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<DashboardPage />} />
                <Route path="/admin/articles" element={<AdminArticlesPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/articles/create" element={<CreateArticle />} />
                <Route path="/articles/:slug/edit" element={<EditArticle />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
