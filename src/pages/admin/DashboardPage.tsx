
import EnhancedDashboardStats from "@/components/admin/EnhancedDashboardStats";
import SalesChart from "@/components/admin/SalesChart";
import TopProductsCard from "@/components/admin/TopProductsCard";
import PaymentStatsCard from "@/components/admin/PaymentStatsCard";
import { PageHeader } from "@/components/ui/page-header";

const DashboardPage = () => {
  return (
    <div className="py-8">
      <PageHeader 
        title="แดชบอร์ด"
        description="ภาพรวมของระบบ, ยอดขาย, PRO Subscription และ VIP Management"
      />
      
      <div className="space-y-8">
        {/* Enhanced Stats with PRO metrics */}
        <EnhancedDashboardStats />
        
        {/* Payment Method Stats */}
        <div>
          <h3 className="text-lg font-medium mb-4">สถิติการชำระเงิน</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <PaymentStatsCard
              title="PRO Subscription"
              amount={125000}
              transactions={45}
              percentage={12}
              icon="stripe"
              trend="up"
            />
            <PaymentStatsCard
              title="VIP Membership"
              amount={89000}
              transactions={32}
              percentage={8}
              icon="promptpay"
              trend="up"
            />
            <PaymentStatsCard
              title="One-time Purchases"
              amount={67000}
              transactions={28}
              percentage={-3}
              icon="omise"
              trend="down"
            />
            <PaymentStatsCard
              title="Academy Course"
              amount={95000}
              transactions={15}
              percentage={25}
              icon="stripe"
              trend="up"
            />
          </div>
        </div>
        
        {/* Charts and Top Products */}
        <div className="grid gap-8 md:grid-cols-2">
          <SalesChart />
          <TopProductsCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
