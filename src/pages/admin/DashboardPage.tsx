
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, ShoppingBag, Users, Mail, BarChart3, Package } from 'lucide-react';
import DashboardStats from "@/components/admin/DashboardStats";
import SalesChart from "@/components/admin/SalesChart";
import TopProductsCard from "@/components/admin/TopProductsCard";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const DashboardPage = () => {
  return (
    <div className="py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">แผงควบคุมผู้ดูแลระบบ</h1>
        <p className="text-muted-foreground mb-6">จัดการส่วนต่างๆ ของเว็บไซต์ Begins Guide</p>
      </div>

      <ErrorBoundary>
        <DashboardStats />
      </ErrorBoundary>

      <div className="grid gap-6 lg:grid-cols-2">
        <ErrorBoundary>
          <SalesChart />
        </ErrorBoundary>
        <ErrorBoundary>
          <TopProductsCard />
        </ErrorBoundary>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText />
              <span>จัดการเนื้อหา</span>
            </CardTitle>
            <CardDescription>สร้าง, แก้ไข, และลบบทความ</CardDescription>
          </CardHeader>
          <CardContent>
             <Link to="/admin/articles" className="text-sm font-medium text-primary hover:underline">
              → ไปที่หน้าจัดการบทความ
             </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <span>จัดการสินค้า</span>
            </CardTitle>
            <CardDescription>จัดการคอร์สออนไลน์และเทมเพลต</CardDescription>
          </CardHeader>
           <CardContent>
             <Link to="/admin/products" className="text-sm font-medium text-primary hover:underline">
              → ไปที่หน้าจัดการสินค้า
             </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>จัดการผู้ใช้</span>
            </CardTitle>
            <CardDescription>ดูและจัดการข้อมูลผู้ใช้งาน</CardDescription>
          </CardHeader>
           <CardContent>
             <Link to="/admin/users" className="text-sm font-medium text-primary hover:underline">
              → ไปที่หน้าจัดการผู้ใช้
             </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span>จัดการคำสั่งซื้อ</span>
            </CardTitle>
            <CardDescription>ดูและจัดการออเดอร์ทั้งหมด</CardDescription>
          </CardHeader>
           <CardContent>
             <Link to="/admin/orders" className="text-sm font-medium text-primary hover:underline">
              → ไปที่หน้าจัดการคำสั่งซื้อ
             </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>ระบบอีเมล</span>
            </CardTitle>
            <CardDescription>ส่งอีเมลและจัดการเทมเพลต</CardDescription>
          </CardHeader>
           <CardContent>
             <Link to="/admin/email" className="text-sm font-medium text-primary hover:underline">
              → ไปที่หน้าจัดการอีเมล
             </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span>รายงานและสถิติ</span>
            </CardTitle>
            <CardDescription>ดาวน์โหลดรายงานและดูสถิติ</CardDescription>
          </CardHeader>
           <CardContent>
             <Link to="/admin/reports" className="text-sm font-medium text-primary hover:underline">
              → ไปที่หน้ารายงาน
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
