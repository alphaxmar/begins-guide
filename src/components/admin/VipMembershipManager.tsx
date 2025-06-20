
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";

const VipMembershipManager = () => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const queryClient = useQueryClient();

  const { data: vipMembers, isLoading } = useQuery({
    queryKey: ["vip_members"],
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

  const addVipMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from("vip_memberships")
        .upsert({
          user_id: userId,
          is_active: true,
          start_date: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("เพิ่มสมาชิก VIP สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["vip_members"] });
      setSelectedUserId("");
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const removeVipMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("vip_memberships")
        .update({ is_active: false })
        .eq("user_id", userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("ยกเลิกสมาชิก VIP สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["vip_members"] });
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          จัดการสมาชิก VIP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="user-id">เพิ่มสมาชิก VIP (User ID)</Label>
          <div className="flex gap-2">
            <Input
              id="user-id"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              placeholder="ใส่ User ID"
              className="flex-1"
            />
            <Button
              onClick={() => addVipMutation.mutate(selectedUserId)}
              disabled={!selectedUserId || addVipMutation.isPending}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              เพิ่ม VIP
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">รายชื่อสมาชิก VIP ปัจจุบัน</h3>
          {isLoading ? (
            <p className="text-muted-foreground">กำลังโหลด...</p>
          ) : vipMembers && vipMembers.length > 0 ? (
            <div className="space-y-2">
              {vipMembers.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="bg-yellow-500">
                      <Crown className="mr-1 h-3 w-3" />
                      VIP
                    </Badge>
                    <span className="font-medium">
                      {member.profiles?.full_name || 'ไม่ระบุชื่อ'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({member.user_id})
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeVipMutation.mutate(member.user_id)}
                    disabled={removeVipMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <UserMinus className="mr-1 h-3 w-3" />
                    ยกเลิก
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">ยังไม่มีสมาชิก VIP</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VipMembershipManager;
