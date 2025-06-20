
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminDashboardStats, useTopSellingProducts, useDailySalesStats } from "@/hooks/useAdminStats";
import { useUsers } from "@/hooks/useUsers";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageHeader } from "@/components/ui/page-header";
import { Download, FileText, Users, ShoppingCart } from "lucide-react";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const AdminReportsPage = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('30');

  const { data: stats } = useAdminDashboardStats();
  const { data: topProducts } = useTopSellingProducts(10);
  const { data: salesData } = useDailySalesStats(Number(dateRange));
  const { data: users } = useUsers();

  const generateCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSalesReport = () => {
    const reportData = salesData?.map(item => ({
      'วันที่': format(new Date(item.sale_date), 'dd/MM/yyyy'),
      'รายได้': Number(item.daily_revenue),
      'จำนวนออเดอร์': Number(item.daily_orders)
    })) || [];
    generateCSV(reportData, 'sales-report');
  };

  const exportProductReport = () => {
    const reportData = topProducts?.map((product, index) => ({
      'อันดับ': index + 1,
      'ชื่อสินค้า': product.product_title,
      'ราคา': Number(product.product_price),
      'ยอดขาย': Number(product.total_sales),
      'รายได้รวม': Number(product.total_revenue)
    })) || [];
    generateCSV(reportData, 'products-report');
  };

  const exportUserReport = () => {
    const reportData = users?.map(user => ({
      'อีเมล': user.email,
      'ชื่อ': user.full_name || '',
      'สิทธิ์': user.role,
      'วันที่สมัคร': format(new Date(user.created_at), 'dd/MM/yyyy'),
      'จำนวนการซื้อ': user.total_purchases,
      'ยอดซื้อรวม': user.total_spent
    })) || [];
    generateCSV(reportData, 'users-report');
  };

  return (
    <div className="py-8">
      <PageHeader 
        title="รายงานและสถิติ"
        description="ดาวน์โหลดรายงานและสถิติของระบบ"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายงานยอดขาย</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 วันที่ผ่านมา</SelectItem>
                  <SelectItem value="30">30 วันที่ผ่านมา</SelectItem>
                  <SelectItem value="90">90 วันที่ผ่านมา</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportSalesReport} size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                ดาวน์โหลด CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายงานสินค้า</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                สินค้าขายดี Top 10
              </p>
              <Button onClick={exportProductReport} size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                ดาวน์โหลด CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายงานผู้ใช้</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                ข้อมูลผู้ใช้ทั้งหมด
              </p>
              <Button onClick={exportUserReport} size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                ดาวน์โหลด CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สรุปรายงาน</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                รายงานภาพรวมทั้งหมด
              </p>
              <Button 
                onClick={() => {
                  exportSalesReport();
                  exportProductReport();
                  exportUserReport();
                }} 
                size="sm" 
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                ดาวน์โหลดทั้งหมด
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>สถิติภาพรวม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>ผู้ใช้งานทั้งหมด:</span>
                <span className="font-bold">{stats?.total_users || 0} คน</span>
              </div>
              <div className="flex justify-between">
                <span>ผู้ใช้งานใหม่เดือนนี้:</span>
                <span className="font-bold">{stats?.new_users_this_month || 0} คน</span>
              </div>
              <div className="flex justify-between">
                <span>รายได้รวม:</span>
                <span className="font-bold">฿{(stats?.total_revenue || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>รายได้เดือนนี้:</span>
                <span className="font-bold">฿{(stats?.revenue_this_month || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>คำสั่งซื้อทั้งหมด:</span>
                <span className="font-bold">{stats?.total_orders || 0} ออเดอร์</span>
              </div>
              <div className="flex justify-between">
                <span>คำสั่งซื้อสำเร็จ:</span>
                <span className="font-bold">{stats?.completed_orders || 0} ออเดอร์</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลการใช้งาน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>อัตราความสำเร็จของออเดอร์:</span>
                <span className="font-bold">
                  {stats?.total_orders ? 
                    Math.round((stats.completed_orders / stats.total_orders) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>รายได้เฉลี่ยต่อออเดอร์:</span>
                <span className="font-bold">
                  ฿{stats?.completed_orders ? 
                    Math.round(stats.total_revenue / stats.completed_orders).toLocaleString() : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>รายได้เฉลี่ยต่อผู้ใช้:</span>
                <span className="font-bold">
                  ฿{stats?.total_users ? 
                    Math.round(stats.total_revenue / stats.total_users).toLocaleString() : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReportsPage;
