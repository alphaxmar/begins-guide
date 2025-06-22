
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, UserPlus, UserMinus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const ProMembershipManager = () => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const queryClient = useQueryClient();

  const { data: proMembers, isLoading } = useQuery({
    queryKey: ["pro_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vip_memberships")
        .select(`
          *,
          profiles!inner(full_name, id)
        `)
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
  });

  const addProMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from("vip_memberships")
        .upsert({
          user_id: userId,
          is_active: true,
          status: 'active',
          start_date: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("เพิ่มสมาชิก PRO สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["pro_members"] });
      setSelectedUserId("");
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const removeProMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("vip_memberships")
        .update({ 
          is_active: false,
          status: 'canceled'
        })
        .eq("user_id", userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("ยกเลิกสมาชิก PRO สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["pro_members"] });
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ใช้งานอยู่';
      case 'trialing': return 'ทดลองใช้';
      case 'past_due': return 'ค้างชำระ';
      case 'canceled': return 'ยกเลิกแล้ว';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          จัดการสมาชิก Begins.guide PRO
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="user-id">เพิ่มสมาชิก PRO (User ID)</Label>
          <div className="flex gap-2">
            <Input
              id="user-id"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              placeholder="ใส่ User ID"
              className="flex-1"
            />
            <Button
              onClick={() => addProMutation.mutate(selectedUserId)}
              disabled={!selectedUserId || addProMutation.isPending}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              เพิ่ม PRO
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">รายชื่อสมาชิก PRO ปัจจุบัน</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["pro_members"] })}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
          </div>
          
          {isLoading ? (
            <p className="text-muted-foreground">กำลังโหลด...</p>
          ) : proMembers && proMembers.length > 0 ? (
            <div className="space-y-2">
              {proMembers.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="bg-yellow-500">
                      <Crown className="mr-1 h-3 w-3" />
                      PRO
                    </Badge>
                    <div className="space-y-1">
                      <span className="font-medium">
                        {member.profiles?.full_name || 'ไม่ระบุชื่อ'}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>({member.user_id})</span>
                        <Badge className={getStatusColor(member.status)}>
                          {getStatusText(member.status)}
                        </Badge>
                      </div>
                      {member.current_period_end_at && (
                        <p className="text-xs text-muted-foreground">
                          หมดอายุ: {format(new Date(member.current_period_end_at), 'dd MMM yyyy HH:mm', { locale: th })}
                        </p>
                      )}
                      {member.stripe_subscription_id && (
                        <p className="text-xs text-muted-foreground">
                          Subscription ID: {member.stripe_subscription_id}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProMutation.mutate(member.user_id)}
                    disabled={removeProMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <UserMinus className="mr-1 h-3 w-3" />
                    ยกเลิก
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">ยังไม่มีสมาชิก PRO</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProMembershipManager;
