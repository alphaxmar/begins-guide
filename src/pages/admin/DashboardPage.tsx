
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardStats from "@/components/admin/DashboardStats";
import SalesChart from "@/components/admin/SalesChart";
import TopProductsCard from "@/components/admin/TopProductsCard";
import PaymentStatsCard from "@/components/admin/PaymentStatsCard";
import { PageHeader } from "@/components/ui/page-header";

const DashboardPage = () => {
  return (
    <AdminLayout>
      <div className="py-8">
        <PageHeader 
          title="แดshboard"
          description="ภาพรวมของระบบและยอดขาย"
        />
        
        <div className="space-y-8">
          {/* Main Stats */}
          <DashboardStats />
          
          {/* Payment Method Stats */}
          <div>
            <h3 className="text-lg font-medium mb-4">สถิติการชำระเงิน</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <PaymentStatsCard
                title="PromptPay"
                amount={125000}
                transactions={45}
                percentage={12}
                icon="promptpay"
                trend="up"
              />
              <PaymentStatsCard
                title="Stripe (ต่างประเทศ)"
                amount={89000}
                transactions={32}
                percentage={8}
                icon="stripe"
                trend="up"
              />
              <PaymentStatsCard
                title="Omise (ในประเทศ)"
                amount={67000}
                transactions={28}
                percentage={-3}
                icon="omise"
                trend="down"
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
    </AdminLayout>
  );
};

export default DashboardPage;
