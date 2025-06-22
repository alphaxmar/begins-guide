
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboardStats } from "@/hooks/useAdminStats";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Users, ShoppingCart, TrendingUp, Clock, Crown, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const EnhancedDashboardStats = () => {
  const { data: stats, isLoading, error } = useAdminDashboardStats();

  const { data: subscriptionStats } = useQuery({
    queryKey: ['subscription-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vip_memberships')
        .select('status, current_period_end_at')
        .eq('is_active', true);
      
      if (error) throw error;

      const activeSubscriptions = data?.filter(sub => 
        sub.status === 'active' || sub.status === 'trialing'
      ).length || 0;
      
      const recurringRevenue = activeSubscriptions * 990; // Assuming 990 baht per month
      
      return {
        activeSubscriptions,
        recurringRevenue,
        totalSubscriptions: data?.length || 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <LoadingSpinner />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>;
  }

  const statCards = [
    {
      title: "ผู้ใช้งานทั้งหมด",
      value: stats?.total_users || 0,
      subtitle: `ใหม่เดือนนี้: ${stats?.new_users_this_month || 0}`,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "รายได้รวม",
      value: `฿${(stats?.total_revenue || 0).toLocaleString()}`,
      subtitle: `เดือนนี้: ฿${(stats?.revenue_this_month || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "สมาชิก PRO (Active)",
      value: subscriptionStats?.activeSubscriptions || 0,
      subtitle: `ทั้งหมด: ${subscriptionStats?.totalSubscriptions || 0}`,
      icon: Crown,
      color: "text-yellow-600"
    },
    {
      title: "รายได้ประจำ (MRR)",
      value: `฿${(subscriptionStats?.recurringRevenue || 0).toLocaleString()}`,
      subtitle: "Monthly Recurring Revenue",
      icon: RefreshCw,
      color: "text-purple-600"
    },
    {
      title: "คำสั่งซื้อรอดำเนินการ",
      value: stats?.pending_orders || 0,
      subtitle: `ล้มเหลว: ${stats?.failed_orders || 0}`,
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EnhancedDashboardStats;
