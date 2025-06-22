
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const location = useLocation();
  const isSubPage = location.pathname !== '/admin' && location.pathname !== '/admin/';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 sm:px-6 lg:px-8">
          {isSubPage && (
            <div className="py-4">
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  กลับสู่แดชบอร์ด
                </Button>
              </Link>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
