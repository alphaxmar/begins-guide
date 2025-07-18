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
  BookOpen,
  Target,
  Star,
  Trophy,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

const AdminSidebar: React.FC = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems: MenuItem[] = [
    { icon: BarChart3, label: "แดชบอร์ด", path: "/admin/dashboard" },
    { icon: Target, label: "Value Ladder Analytics", path: "/admin/value-ladder" },
    { icon: Users, label: "ผู้ใช้งาน", path: "/admin/users" },
    { icon: ShoppingCart, label: "คำสั่งซื้อ", path: "/admin/orders" },
    { icon: Package, label: "สินค้า", path: "/admin/products" },
    { icon: FileText, label: "บทความ", path: "/admin/articles" },
  ];

  const membershipItems: MenuItem[] = [
    { icon: BookOpen, label: "สมาชิก Reader", path: "/admin/reader-memberships" },
    { icon: Package, label: "แพ็กเกจ Reader", path: "/admin/reader-packages" },
    { icon: Crown, label: "สมาชิก PRO", path: "/admin/pro-memberships" },
    { icon: Gift, label: "แพ็กเกจ PRO", path: "/admin/pro-packages" },
    { icon: Gem, label: "สมาชิก VIP", path: "/admin/vip-management" },
    { icon: Package2, label: "แพ็กเกจ VIP", path: "/admin/vip-packages" },
    { icon: Star, label: "สมาชิก Circle", path: "/admin/circle-memberships" },
    { icon: Trophy, label: "แพ็กเกจ Circle", path: "/admin/circle-packages" },
  ];

  const systemItems: MenuItem[] = [
    { icon: Target, label: "Beginner Analytics", path: "/admin/beginner-analytics" },
    { icon: UserCheck, label: "Affiliates", path: "/admin/affiliates" },
    { icon: Percent, label: "โค้ดส่วนลด", path: "/admin/discount-codes" },
    { icon: CreditCard, label: "การชำระเงิน", path: "/admin/payment-settings" },
    { icon: Receipt, label: "ตรวจสอบสลิป", path: "/admin/payment-slips" },
    { icon: Mail, label: "อีเมล", path: "/admin/email-templates" },
    { icon: FileBarChart, label: "รายงาน", path: "/admin/reports" },
  ];

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "";

  const renderMenuSection = (items: MenuItem[], label?: string) => (
    <SidebarGroup key={label}>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <NavLink to={item.path} className={getNavClassName}>
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="gap-0">
        <div className="p-4 border-b">
          <h2 className={`font-bold text-lg ${isCollapsed ? "sr-only" : ""}`}>
            Admin Panel
          </h2>
        </div>
        
        {renderMenuSection(menuItems, "หลัก")}
        {renderMenuSection(membershipItems, "สมาชิกภาพ")}
        {renderMenuSection(systemItems, "ระบบ")}
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
