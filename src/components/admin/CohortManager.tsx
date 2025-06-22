
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Plus, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCohortsByProduct } from "@/hooks/useCohorts";
import { format } from "date-fns";

interface CohortManagerProps {
  productId: string;
  productTitle: string;
}

const CohortManager: React.FC<CohortManagerProps> = ({ productId, productTitle }) => {
  const { data: cohorts, isLoading } = useCohortsByProduct(productId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'กำลังจะเริ่ม';
      case 'active': return 'กำลังดำเนินการ';
      case 'completed': return 'เสร็จสิ้นแล้ว';
      case 'cancelled': return 'ยกเลิกแล้ว';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">กำลังโหลดข้อมูล Cohort...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">จัดการ Cohort</h3>
          <p className="text-sm text-muted-foreground">โปรแกรม: {productTitle}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              สร้าง Cohort ใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>สร้าง Cohort ใหม่</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">ชื่อ Cohort</Label>
                <Input id="name" placeholder="เช่น รุ่นที่ 3 (ต.ค. - ธ.ค. 2568)" />
              </div>
              <div>
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea id="description" placeholder="รายละเอียดของรุ่นนี้..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">วันเริ่มต้น</Label>
                  <Input id="start_date" type="datetime-local" />
                </div>
                <div>
                  <Label htmlFor="end_date">วันสิ้นสุด</Label>
                  <Input id="end_date" type="datetime-local" />
                </div>
              </div>
              <div>
                <Label htmlFor="max_students">จำนวนนักเรียนสูงสุด</Label>
                <Input id="max_students" type="number" defaultValue="50" />
              </div>
              <div>
                <Label htmlFor="community_link">ลิงก์กลุ่มส่วนตัว</Label>
                <Input id="community_link" placeholder="https://discord.gg/..." />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button>สร้าง Cohort</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {cohorts && cohorts.length > 0 ? (
        <div className="grid gap-4">
          {cohorts.map((cohort) => (
            <Card key={cohort.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{cohort.name}</CardTitle>
                    {cohort.description && (
                      <p className="text-sm text-muted-foreground mt-1">{cohort.description}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(cohort.status)}>
                    {getStatusText(cohort.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">เริ่ม</p>
                      <p className="text-muted-foreground">
                        {format(new Date(cohort.start_date), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">สิ้นสุด</p>
                      <p className="text-muted-foreground">
                        {format(new Date(cohort.end_date), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">นักเรียน</p>
                      <p className="text-muted-foreground">
                        {cohort.current_students}/{cohort.max_students}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      จัดการ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">ยังไม่มี Cohort สำหรับโปรแกรมนี้</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              สร้าง Cohort แรก
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CohortManager;
