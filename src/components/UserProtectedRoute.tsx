
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface UserProtectedRouteProps {
  children: ReactNode;
}

const UserProtectedRoute = ({ children }: UserProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect them to the /auth page, but save the current location they were
    // trying to go to. This allows us to send them along to their original
    // destination after they log in.
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default UserProtectedRoute;
