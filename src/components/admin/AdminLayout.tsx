
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const isSubPage = location.pathname !== '/admin' && location.pathname !== '/admin/';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b bg-background px-4">
            <SidebarTrigger className="mr-4" />
            {isSubPage && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  กลับสู่แดชบอร์ด
                </Button>
              </Link>
            )}
          </header>
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
