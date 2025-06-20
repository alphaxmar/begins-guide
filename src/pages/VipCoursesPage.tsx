
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useVipStatus } from "@/hooks/useVipStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, BookOpen, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useEffect } from "react";

const VipCoursesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { isVip, isLoading: vipLoading } = useVipStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!vipLoading && !isVip && user) {
      toast.error("หน้านี้สำหรับสมาชิก VIP เท่านั้น");
      navigate("/profile");
    }
  }, [isVip, vipLoading, user, navigate]);

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['vip-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'course')
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user && isVip,
  });

  if (authLoading || vipLoading) {
    return <div className="text-center py-12">กำลังตรวจสอบสิทธิ์...</div>;
  }

  if (!user || !isVip) {
    return null;
  }

  if (coursesLoading) {
    return (
      <div className="py-12 max-w-6xl mx-auto px-4">
        <div className="space-y-6">
          <div className="text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">คอร์สทั้งหมดสำหรับ VIP</h1>
        </div>
        <p className="text-muted-foreground">
          เข้าถึงคอร์สเรียนทั้งหมดได้ไม่จำกัดสำหรับสมาชิก VIP
        </p>
        <Badge variant="default" className="mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <Crown className="mr-1 h-3 w-3" />
          สมาชิก VIP
        </Badge>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/5">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold mt-4">ยังไม่มีคอร์สเรียน</h3>
          <p className="text-muted-foreground mt-1">คอร์สเรียนจะปรากฏที่นี่เมื่อมีการเพิ่มเข้ามา</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                {course.image_url ? (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge 
                  variant="default"
                  className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                >
                  <Crown className="mr-1 h-3 w-3" />
                  VIP Free
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                {course.description && (
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground line-through">
                    ราคาปกติ {course.price.toLocaleString()} บาท
                  </span>
                  <span className="text-lg font-bold text-green-600">ฟรี</span>
                </div>
                
                <Button asChild className="w-full">
                  <Link to={`/courses/${course.slug}/learn`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    เข้าสู่บทเรียน
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VipCoursesPage;
