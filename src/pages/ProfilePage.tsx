
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/components/profile/ProfileForm";
import PurchasedItemsList from "@/components/profile/PurchasedItemsList";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
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
      
      if (error && error.code !== 'PGRST116') { // PGRST116: The result contains 0 rows
        throw new Error(error.message);
      }
      return data;
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
    <div className="py-12 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>โปรไฟล์ของคุณ</CardTitle>
          <CardDescription>จัดการข้อมูลส่วนตัวและดูสินค้าของคุณ</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} profile={profile} />
          <PurchasedItemsList user={user} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
