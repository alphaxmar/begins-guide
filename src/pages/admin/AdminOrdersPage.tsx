
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useAdminOrders";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageHeader } from "@/components/ui/page-header";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

const AdminOrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const { data: orders, isLoading } = useAdminOrders(statusFilter || undefined);
  const updateOrderStatus = useUpdateOrderStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'สำเร็จ';
      case 'pending': return 'รอดำเนินการ';
      case 'failed': return 'ล้มเหลว';
      case 'processing': return 'กำลังดำเนินการ';
      case 'refunded': return 'คืนเงิน';
      default: return status;
    }
  };

  return (
    <div className="py-8">
      <PageHeader 
        title="จัดการคำสั่งซื้อ"
        description="ดูและจัดการคำสั่งซื้อทั้งหมดในระบบ"
      />
      
      <div className="mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="กรองตามสถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">ทั้งหมด</SelectItem>
            <SelectItem value="pending">รอดำเนินการ</SelectItem>
            <SelectItem value="processing">กำลังดำเนินการ</SelectItem>
            <SelectItem value="completed">สำเร็จ</SelectItem>
            <SelectItem value="failed">ล้มเหลว</SelectItem>
            <SelectItem value="refunded">คืนเงิน</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการคำสั่งซื้อ</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>ยอดรวม</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>วันที่สั่งซื้อ</TableHead>
                  <TableHead>จำนวนสินค้า</TableHead>
                  <TableHead>การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell className="font-mono text-xs">
                      {order.order_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.user_full_name || 'ไม่ระบุชื่อ'}</p>
                        <p className="text-xs text-muted-foreground">{order.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>฿{Number(order.total_amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), 'dd MMM yyyy HH:mm', { locale: th })}
                    </TableCell>
                    <TableCell>{order.items_count} รายการ</TableCell>
                    <TableCell>
                      <Select 
                        value={order.status}
                        onValueChange={(newStatus: OrderStatus) => 
                          updateOrderStatus.mutate({ 
                            orderId: order.order_id, 
                            newStatus 
                          })
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">รอดำเนินการ</SelectItem>
                          <SelectItem value="processing">กำลังดำเนินการ</SelectItem>
                          <SelectItem value="completed">สำเร็จ</SelectItem>
                          <SelectItem value="failed">ล้มเหลว</SelectItem>
                          <SelectItem value="refunded">คืนเงิน</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {orders && orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              ไม่พบคำสั่งซื้อ
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersPage;
