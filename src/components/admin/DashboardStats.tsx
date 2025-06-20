
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboardStats } from "@/hooks/useAdminStats";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Users, ShoppingCart, TrendingUp, Clock } from "lucide-react";

const DashboardStats = () => {
  const { data: stats, isLoading, error } = useAdminDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
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
      title: "คำสั่งซื้อทั้งหมด",
      value: stats?.total_orders || 0,
      subtitle: `สำเร็จ: ${stats?.completed_orders || 0}`,
      icon: ShoppingCart,
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

export default DashboardStats;
