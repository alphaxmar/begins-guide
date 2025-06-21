
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, BookOpen, FileText, ShoppingBag, Package } from "lucide-react";
import ProfileForm from "@/components/profile/ProfileForm";
import PurchasedItemsList from "@/components/profile/PurchasedItemsList";
import VipStatusCard from "@/components/profile/VipStatusCard";
import { useVipStatus } from "@/hooks/useVipStatus";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { isVip } = useVipStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("คุณต้องเข้าสู่ระบบก่อน");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user,
  });

  // เพิ่ม query สำหรับนับจำนวนสินค้าที่ซื้อแล้ว
  const { data: purchaseCount } = useQuery({
    queryKey: ['purchase_count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { data, error } = await supabase
        .from('user_purchases')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      if (error) {
        console.error("Error counting purchases:", error);
        return 0;
      }
      
      return data?.length || 0;
    },
    enabled: !!user,
  });
  
  if (authLoading || profileLoading) {
    return <div className="text-center py-12">กำลังโหลดข้อมูลโปรไฟล์...</div>;
  }

  if (profileError) {
    return <div className="text-center py-12 text-destructive">เกิดข้อผิดพลาดในการโหลดข้อมูล: {profileError.message}</div>;
  }
  
  if (!user) return null;

  return (
    <div className="py-12 max-w-6xl mx-auto px-4">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>โปรไฟล์ของคุณ</CardTitle>
              <CardDescription>จัดการข้อมูลส่วนตัวและดูสินค้าของคุณ</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} profile={profile} />
            </CardContent>
          </Card>

          {/* Quick Access Cards - ปุ่มนำทางที่ชัดเจน */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                สินค้าและคอร์สของฉัน
              </CardTitle>
              <CardDescription>
                เข้าถึงคอร์สเรียนและเทมเพลตที่คุณซื้อแล้ว
                {purchaseCount !== undefined && ` (${purchaseCount} รายการ)`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-20 flex-col bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200"
                >
                  <div className="cursor-pointer" onClick={() => {
                    const element = document.getElementById('purchased-items-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    <Package className="h-6 w-6 mb-2 text-blue-600" />
                    <span className="font-medium">สินค้าทั้งหมด</span>
                    <span className="text-xs text-muted-foreground">
                      {purchaseCount || 0} รายการ
                    </span>
                  </div>
                </Button>
                
                <Button asChild variant="outline" className="h-20 flex-col bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200">
                  <Link to="/products">
                    <ShoppingBag className="h-6 w-6 mb-2 text-green-600" />
                    <span className="font-medium">เลือกซื้อเพิ่ม</span>
                    <span className="text-xs text-muted-foreground">สินค้าใหม่</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* VIP Quick Access - show only for VIP users */}
          {isVip && (
            <Card className="mt-8 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  เข้าถึงเนื้อหา VIP
                </CardTitle>
                <CardDescription>
                  เข้าถึงคอร์สและเทมเพลตทั้งหมดได้ไม่จำกัด
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Button asChild variant="outline" className="h-20 flex-col bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-yellow-300">
                    <Link to="/vip/courses">
                      <BookOpen className="h-6 w-6 mb-2 text-amber-600" />
                      <span className="font-medium">คอร์สทั้งหมด</span>
                      <span className="text-xs text-muted-foreground">สำหรับ VIP</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-yellow-300">
                    <Link to="/vip/templates">
                      <FileText className="h-6 w-6 mb-2 text-amber-600" />
                      <span className="font-medium">เทมเพลตทั้งหมด</span>
                      <span className="text-xs text-muted-foreground">สำหรับ VIP</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* รายการสินค้าที่ซื้อแล้ว */}
          <div id="purchased-items-section" className="mt-8">
            <PurchasedItemsList user={user} />
          </div>
        </div>
        
        <div className="space-y-6">
          <VipStatusCard />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
