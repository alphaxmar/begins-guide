
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Mail,
  CreditCard,
  Settings,
  Crown,
  Percent
} from 'lucide-react';

const navigation = [
  { name: 'แดชบอร์ด', href: '/admin', icon: LayoutDashboard },
  { name: 'จัดการบทความ', href: '/admin/articles', icon: FileText },
  { name: 'จัดการสินค้า', href: '/admin/products', icon: Package },
  { name: 'จัดการแพ็กเกจ VIP', href: '/admin/vip-packages', icon: Crown },
  { name: 'โค้ดส่วนลด', href: '/admin/discount-codes', icon: Percent },
  { name: 'คำสั่งซื้อ', href: '/admin/orders', icon: ShoppingCart },
  { name: 'จัดการผู้ใช้', href: '/admin/users', icon: Users },
  { name: 'รายงาน', href: '/admin/reports', icon: BarChart3 },
  { name: 'อีเมล', href: '/admin/email', icon: Mail },
  { name: 'ตั้งค่าการชำระเงิน', href: '/admin/payment-settings', icon: CreditCard },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Link to="/admin" className="flex items-center space-x-2">
            <Settings className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        location.pathname === item.href
                          ? 'bg-gray-50 text-primary'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                      )}
                    >
                      <item.icon
                        className={cn(
                          location.pathname === item.href ? 'text-primary' : 'text-gray-400 group-hover:text-primary',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
