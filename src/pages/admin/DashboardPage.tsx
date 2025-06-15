
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, ShoppingBag, Users } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-2">แผงควบคุมผู้ดูแลระบบ</h1>
      <p className="text-muted-foreground mb-6">จัดการส่วนต่างๆ ของเว็บไซต์ Begins Guide</p>
      
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

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span>จัดการผู้ใช้</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">ดูและจัดการข้อมูลผู้ใช้งาน (เร็วๆ นี้)</CardDescription>
          </CardHeader>
           <CardContent>
             <span className="text-sm font-medium text-muted-foreground/60">
              ยังไม่เปิดใช้งาน
             </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
