import React from "react";
import {
  BarChart3,
  Users,
  ShoppingCart,
  Package,
  FileText,
  Percent,
  CreditCard,
  Mail,
  FileBarChart,
  Crown,
  Gift,
  UserCheck,
  Gem,
  Package2,
  Receipt,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

const AdminSidebar: React.FC = () => {
  const menuItems = [
    { icon: BarChart3, label: "แดชบอร์ด", path: "/admin/dashboard" },
    { icon: Users, label: "ผู้ใช้งาน", path: "/admin/users" },
    { icon: ShoppingCart, label: "คำสั่งซื้อ", path: "/admin/orders" },
    { icon: Package, label: "สินค้า", path: "/admin/products" },
    { icon: FileText, label: "บทความ", path: "/admin/articles" },
    
    // PRO Subscription menu items
    { icon: Crown, label: "สมาชิก PRO", path: "/admin/pro-memberships" },
    { icon: Gift, label: "แพ็กเกจ PRO", path: "/admin/pro-packages" },
    
    // VIP Management menu items
    { icon: Gem, label: "สมาชิก VIP", path: "/admin/vip-management" },
    { icon: Package2, label: "แพ็กเกจ VIP", path: "/admin/vip-packages" },
    
    { icon: UserCheck, label: "Affiliates", path: "/admin/affiliates" },
    { icon: Percent, label: "โค้ดส่วนลด", path: "/admin/discount-codes" },
    { icon: CreditCard, label: "การชำระเงิน", path: "/admin/payment-settings" },
    { icon: Receipt, label: "ตรวจสอบสลิป", path: "/admin/payment-slips" },
    { icon: Mail, label: "อีเมล", path: "/admin/email-templates" },
    { icon: FileBarChart, label: "รายงาน", path: "/admin/reports" },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full py-4 px-2">
      <div className="font-bold text-xl mb-4 px-2">Admin Panel</div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isActive ? "bg-gray-100 font-medium" : ""
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
