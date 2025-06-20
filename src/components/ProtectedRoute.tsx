
import React, { PropsWithChildren } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<PropsWithChildren<ProtectedRouteProps>> = ({ children, adminOnly = false }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading, error: adminError } = useAdmin();
  const location = useLocation();

  console.log('ProtectedRoute state:', {
    user: !!user,
    authLoading,
    adminOnly,
    isAdmin,
    adminLoading,
    adminError
  });

  // Show loading while checking authentication
  if (authLoading || (user && adminLoading)) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    console.log('No user, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check admin access if required
  if (adminOnly) {
    if (adminError) {
      console.error('Admin check error:', adminError);
      return (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600">เกิดข้อผิดพลาด</h2>
            <p className="text-gray-600">ไม่สามารถตรวจสอบสิทธิ์ได้ กรุณาลองใหม่อีกครั้ง</p>
          </div>
        </div>
      );
    }

    if (!isAdmin) {
      console.log('User is not admin, redirecting to home');
      return <Navigate to="/" replace />;
    }
  }

  console.log('Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
