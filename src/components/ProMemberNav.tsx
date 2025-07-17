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
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useVipStatus } from '@/hooks/useVipStatus';

export function ProMemberNav() {
  const navigate = useNavigate();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();
  const { isVip } = useVipStatus();

  if (!isVip) return null;

  return (
    <NavigationMenu className="mb-8">
      <NavigationMenuList>
        {hasBookAccess && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>หนังสือของฉัน</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 w-[400px]">
                <NavigationMenuLink
                  className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  onClick={() => navigate('/book')}
                >
                  <div className="text-sm font-medium leading-none">หน้าหนังสือ</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    กลับไปยังหน้าหนังสือของคุณ
                  </p>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}

        {hasCourseAccess && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>คอร์สของฉัน</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-4 w-[400px]">
                <NavigationMenuLink
                  className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  onClick={() => navigate('/courses')}
                >
                  <div className="text-sm font-medium leading-none">หน้าคอร์ส</div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    กลับไปยังหน้าคอร์สเรียนของคุณ
                  </p>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}

        <NavigationMenuItem>
          <NavigationMenuTrigger>Pro Member</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <NavigationMenuLink
                className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                onClick={() => navigate('/pro')}
              >
                <div className="text-sm font-medium leading-none">Pro Dashboard</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  กลับไปยังหน้า Pro Dashboard ของคุณ
                </p>
              </NavigationMenuLink>
              <NavigationMenuLink
                className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                onClick={() => navigate('/toolbox')}
              >
                <div className="text-sm font-medium leading-none">Toolbox</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  เครื่องมือสำหรับสมาชิก Pro
                </p>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
