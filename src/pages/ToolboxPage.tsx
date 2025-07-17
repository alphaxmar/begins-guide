import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useVipStatus } from '@/hooks/useVipStatus';
import { Button } from '@/components/ui/button';
import { ToolboxModal } from '@/components/ToolboxModal';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useNavigate } from 'react-router-dom';

export default function ToolboxPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();
  const { isVip } = useVipStatus();

  if (!hasBookAccess && !hasCourseAccess && !isVip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-center mt-4">
          คุณต้องซื้อหนังสือ คอร์ส หรือเป็นสมาชิก Pro เพื่อเข้าถึงเครื่องมือ
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

          {isVip && (
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
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Toolbox</h1>
        <p className="text-lg text-gray-600 mb-8">
          เครื่องมือช่วยสร้างและพัฒนาธุรกิจของคุณ
        </p>
        <Button
          size="lg"
          onClick={() => setIsModalOpen(true)}
        >
          เปิดกล่องเครื่องมือ
        </Button>
      </div>

      <ToolboxModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
