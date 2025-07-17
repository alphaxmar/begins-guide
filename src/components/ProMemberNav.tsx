import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useVipStatus } from '@/hooks/useVipStatus';
import { BookOpen, GraduationCap, Crown, Wrench, LayoutDashboard, Users } from 'lucide-react';

export function ProMemberNav() {
  const navigate = useNavigate();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();
  const { isVip } = useVipStatus();

  if (!isVip) return null;

  const menuItems = [
    {
      trigger: "หนังสือของฉัน",
      show: hasBookAccess,
      icon: <BookOpen className="h-4 w-4" />,
      items: [
        {
          title: "หน้าหนังสือ",
          description: "เข้าสู่เนื้อหาหนังสือที่คุณซื้อแล้ว",
          onClick: () => navigate('/book'),
          icon: <BookOpen className="h-4 w-4" />
        }
      ]
    },
    {
      trigger: "คอร์สของฉัน",
      show: hasCourseAccess,
      icon: <GraduationCap className="h-4 w-4" />,
      items: [
        {
          title: "หน้าคอร์ส",
          description: "เข้าสู่คอร์สเรียนของคุณ",
          onClick: () => navigate('/courses'),
          icon: <GraduationCap className="h-4 w-4" />
        }
      ]
    },
    {
      trigger: "Pro Member",
      show: true,
      icon: <Crown className="h-4 w-4" />,
      badge: "PRO",
      items: [
        {
          title: "Pro Dashboard",
          description: "แดชบอร์ดส่วนตัวของ Pro Member",
          onClick: () => navigate('/pro'),
          icon: <LayoutDashboard className="h-4 w-4" />
        },
        {
          title: "AI Toolbox",
          description: "เครื่องมือ AI สำหรับสมาชิก Pro",
          onClick: () => navigate('/toolbox'),
          icon: <Wrench className="h-4 w-4" />
        },
        {
          title: "Affiliate Program",
          description: "โปรแกรมพันธมิตรและรายได้เสริม",
          onClick: () => navigate('/affiliate'),
          icon: <Users className="h-4 w-4" />
        }
      ]
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-4 mb-8">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="gap-2">
          {menuItems
            .filter(menu => menu.show)
            .map((menu, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-200">
                  {menu.icon}
                  <span className="font-medium">{menu.trigger}</span>
                  {menu.badge && (
                    <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0 text-xs px-2 py-0.5">
                      {menu.badge}
                    </Badge>
                  )}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-2 p-4 w-[450px]">
                    {menu.items.map((item, itemIndex) => (
                      <NavigationMenuLink
                        key={itemIndex}
                        className="cursor-pointer group block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md border border-transparent hover:border-blue-100"
                        onClick={item.onClick}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 group-hover:scale-110 transition-transform duration-200">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm font-semibold leading-none text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                              {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
