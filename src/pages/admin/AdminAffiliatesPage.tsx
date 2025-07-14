import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAffiliates } from '@/hooks/useAdminAffiliates';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Users, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const AdminAffiliatesPage = () => {
  const { 
    affiliates, 
    pendingCommissions, 
    isLoading, 
    updateAffiliateStatus, 
    approveCommission 
  } = useAdminAffiliates();

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    setActionLoading(userId);
    try {
      await updateAffiliateStatus.mutateAsync({ userId, status: newStatus });
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveCommission = async (saleId: string) => {
    setActionLoading(saleId);
    try {
      await approveCommission.mutateAsync(saleId);
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const totalCommissionsPending = pendingCommissions.reduce(
    (sum, commission) => sum + commission.commission_amount, 
    0
  );

  const activeAffiliates = affiliates.filter(a => a.status === 'active').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">จัดการระบบ Affiliate</h1>
        <p className="text-muted-foreground mt-2">
          ควบคุมและจัดการนักการตลาดและค่าคอมมิชชั่น
        </p>
      </div>

      {/* สถิติรวม */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliates ทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Affiliates</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeAffiliates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอจ่ายคอมมิชชั่น</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingCommissions.length} รายการ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดรอจ่าย</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ฿{totalCommissionsPending.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="affiliates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="affiliates">จัดการ Affiliates</TabsTrigger>
          <TabsTrigger value="commissions">
            อนุมัติค่าคอมมิชชั่น
            {pendingCommissions.length > 0 && (
              <Badge className="ml-2 bg-red-500">{pendingCommissions.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="affiliates">
          <Card>
            <CardHeader>
              <CardTitle>รายชื่อ Affiliates ทั้งหมด</CardTitle>
              <CardDescription>
                จัดการสถานะและดูสถิติของ Affiliates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อ-นามสกุล</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>Affiliate Code</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>ยอดขายทั้งหมด</TableHead>
                    <TableHead>คอมมิชชั่นรวม</TableHead>
                    <TableHead>วันที่เข้าร่วม</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map((affiliate) => (
                    <TableRow key={affiliate.user_id}>
                      <TableCell className="font-medium">
                        {affiliate.full_name || 'ไม่ระบุชื่อ'}
                      </TableCell>
                      <TableCell>{affiliate.email}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {affiliate.affiliate_code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            affiliate.status === 'active' 
                              ? 'default' 
                              : affiliate.status === 'inactive' 
                              ? 'destructive' 
                              : 'secondary'
                          }
                        >
                          {affiliate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{affiliate.total_sales} ครั้ง</TableCell>
                      <TableCell>฿{affiliate.total_commission.toLocaleString()}</TableCell>
                      <TableCell>
                        {format(new Date(affiliate.created_at), 'dd MMM yyyy', { locale: th })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {affiliate.status === 'active' ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(affiliate.user_id, 'inactive')}
                              disabled={actionLoading === affiliate.user_id}
                            >
                              {actionLoading === affiliate.user_id ? (
                                <LoadingSpinner className="h-3 w-3" />
                              ) : (
                                'Deactivate'
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(affiliate.user_id, 'active')}
                              disabled={actionLoading === affiliate.user_id}
                            >
                              {actionLoading === affiliate.user_id ? (
                                <LoadingSpinner className="h-3 w-3" />
                              ) : (
                                'Activate'
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {affiliates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  ยังไม่มี Affiliates ในระบบ
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>รายการค่าคอมมิชชั่นที่รอจ่าย</CardTitle>
              <CardDescription>
                อนุมัติการจ่ายค่าคอมมิชชั่นหลังจากโอนเงินแล้ว
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่เกิดรายการ</TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>สินค้าอ้างอิง</TableHead>
                    <TableHead>อัตราคอมมิชชั่น</TableHead>
                    <TableHead>ยอดคอมมิชชั่น</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        {format(new Date(commission.created_at), 'dd MMM yyyy HH:mm', { locale: th })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {commission.affiliate_name || 'ไม่ระบุชื่อ'}
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {commission.affiliate_code}
                        </code>
                      </TableCell>
                      <TableCell>{commission.product_title}</TableCell>
                      <TableCell>{(commission.commission_rate * 100).toFixed(0)}%</TableCell>
                      <TableCell className="font-bold text-green-600">
                        ฿{commission.commission_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleApproveCommission(commission.id)}
                          disabled={actionLoading === commission.id}
                        >
                          {actionLoading === commission.id ? (
                            <LoadingSpinner className="h-3 w-3" />
                          ) : (
                            'Mark as Paid'
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pendingCommissions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  ไม่มีค่าคอมมิชชั่นรอจ่าย
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAffiliatesPage;