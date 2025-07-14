import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from 'lucide-react';

const routeMap: Record<string, string> = {
  '/': 'หน้าแรก',
  '/articles': 'บทความ',
  '/courses': 'คอร์สออนไลน์',
  '/products': 'ผลิตภัณฑ์',
  '/pricing': 'ราคา',
  '/ai-tools': 'AI Tools',
  '/profile': 'โปรไฟล์',
  '/cart': 'ตะกร้าสินค้า',
  '/auth': 'เข้าสู่ระบบ',
  '/admin': 'ผู้ดูแลระบบ',
};

export const BreadcrumbNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumb on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 border-b bg-background/50">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                หน้าแรก
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = routeMap[routeTo] || name;

            return (
              <React.Fragment key={routeTo}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{displayName}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo}>{displayName}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};