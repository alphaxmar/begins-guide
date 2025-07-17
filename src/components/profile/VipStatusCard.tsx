
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, ArrowRight, AlertCircle, Settings } from "lucide-react";
import { useVipStatus } from "@/hooks/useVipStatus";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const VipStatusCard = () => {
  const { isVip, isLoading, error } = useVipStatus();
  const [loadingPortal, setLoadingPortal] = useState(false);

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-customer-portal');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Customer portal error:', error);
      toast.error('เกิดข้อผิดพลาดในการเปิด Customer Portal');
    } finally {
      setLoadingPortal(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-16 bg-muted animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>ไม่สามารถตรวจสอบสถานะ PRO ได้</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isVip ? "border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isVip ? (
            <>
              <Crown className="h-5 w-5 text-yellow-600" />
              สถานะสมาชิก PRO
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              สถานะสมาชิก
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isVip ? (
          <div className="space-y-4">
            <Badge className="bg-yellow-500 hover:bg-yellow-600">
              <Crown className="mr-1 h-3 w-3" />
              สมาชิก PRO
            </Badge>
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-800">สิทธิประโยชน์ของคุณ:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• เข้าถึงคอร์สทั้งหมดได้ไม่จำกัด</li>
                <li>• ดาวน์โหลดเทมเพลตทั้งหมดฟรี</li>
                <li>• เข้าถึงเครื่องมือ AI Power Tools</li>
                <li>• เข้าถึงเนื้อหาใหม่ก่อนใคร</li>
                <li>• ไม่มีข้อจำกัดในการดาวน์โหลด</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/courses" className="flex items-center gap-2">
                  ดูคอร์สทั้งหมด
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleManageSubscription}
                disabled={loadingPortal}
              >
                <Settings className="mr-2 h-4 w-4" />
                {loadingPortal ? "กำลังโหลด..." : "จัดการสมาชิกภาพ"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">สมาชิกทั่วไป</Badge>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">
                    สมาชิก PRO ได้อะไรบ้าง?
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>✨ เข้าถึงคอร์สทั้งหมดไม่จำกัด</li>
                    <li>📄 ดาวน์โหลดเทมเพลตทั้งหมดฟรี</li>
                    <li>🤖 ใช้เครื่องมือ AI Power Tools</li>
                    <li>🎯 เข้าถึงเนื้อหาใหม่ก่อนใคร</li>
                    <li>🔄 อัพเดตตลอดชีวิต</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">
                เริ่มต้นด้วยคอร์สเดี่ยว หรืออัพเกรด PRO เลย?
              </p>
              
              <div className="grid gap-3">
                <Button asChild className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600">
                  <Link to="/pricing" className="flex items-center justify-center gap-2">
                    <Crown className="h-4 w-4" />
                    อัพเกรดเป็น PRO
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/products" className="flex items-center justify-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    ดูคอร์สเดี่ยว
                  </Link>
                </Button>
              </div>
            </div>

            <div className="text-center pt-2 border-t">
              <p className="text-xs text-gray-500">
                💡 เริ่มต้นฟรี: ลองดูคอร์สและเทมเพลตฟรีก่อน
              </p>
              <Button variant="ghost" size="sm" asChild className="mt-1">
                <Link to="/products?price=free" className="text-blue-600 hover:text-blue-800">
                  ดูสินค้าฟรี →
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VipStatusCard;
