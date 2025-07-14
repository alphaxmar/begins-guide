import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAffiliate } from '@/hooks/useAffiliate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, DollarSign, TrendingUp, Clock, CheckCircle, Users, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AffiliatePage = () => {
  const { user } = useAuth();
  const { 
    affiliateData, 
    salesData, 
    stats, 
    isLoadingAffiliate, 
    isLoadingSales, 
    isCreating, 
    createAffiliateCode, 
    getAffiliateLink, 
    isAffiliate 
  } = useAffiliate();

  const [copiedUrl, setCopiedUrl] = useState<string>('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    toast.success(`📋 คัดลอก ${label} เรียบร้อย!`);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-200"><Clock className="w-3 h-3 mr-1" />รอจ่าย</Badge>;
      case 'paid':
        return <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />จ่ายแล้ว</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="text-red-600 border-red-200">คืนเงิน</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoadingAffiliate) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              โปรแกรม Affiliate
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            แนะนำเพื่อนและรับค่าคอมมิชชั่น 30% จากทุกการขาย
          </p>
        </div>

        {!isAffiliate ? (
          // Join Affiliate Program Section
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">เข้าร่วมโปรแกรม Affiliate</CardTitle>
              <CardDescription className="text-base">
                เริ่มหารายได้จากการแนะนำเพื่อนให้เรียนคอร์สกับเรา
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-primary">30%</div>
                  <div className="text-sm text-muted-foreground">ค่าคอมมิชชั่น</div>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-primary">30</div>
                  <div className="text-sm text-muted-foreground">วันติดตาม</div>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-primary">∞</div>
                  <div className="text-sm text-muted-foreground">ไม่จำกัดการแนะนำ</div>
                </div>
              </div>
              
              <Button 
                onClick={() => createAffiliateCode()} 
                disabled={isCreating} 
                size="lg"
                className="px-8"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    กำลังสร้างโค้ด...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    เข้าร่วมโปรแกรม Affiliate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Affiliate Dashboard
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ยอดขายทั้งหมด</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSales}</div>
                  <p className="text-xs text-muted-foreground">การขายที่สำเร็จ</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ค่าคอมฯ รวม</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿{stats.totalCommission.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">ค่าคอมมิชชั่นทั้งหมด</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">รอจ่าย</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">฿{stats.pendingCommission.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">รอการอนุมัติ</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">จ่ายแล้ว</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">฿{stats.paidCommission.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">รับแล้ว</p>
                </CardContent>
              </Card>
            </div>

            {/* Affiliate Links Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  ลิงก์ Affiliate ของคุณ
                </CardTitle>
                <CardDescription>
                  ใช้ลิงก์เหล่านี้ในการแนะนำเพื่อน คุณจะได้รับ 30% จากทุกการซื้อ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Homepage Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">หน้าแรก</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={getAffiliateLink()} 
                      readOnly 
                      className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(getAffiliateLink(), 'ลิงก์หน้าแรก')}
                    >
                      <Copy className="w-4 h-4" />
                      {copiedUrl === getAffiliateLink() ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                    </Button>
                  </div>
                </div>

                {/* Products Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">หน้าสินค้า</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={getAffiliateLink('products')} 
                      readOnly 
                      className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(getAffiliateLink('products'), 'ลิงก์หน้าสินค้า')}
                    >
                      <Copy className="w-4 h-4" />
                      {copiedUrl === getAffiliateLink('products') ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                  💡 <strong>เทคนิค:</strong> แชร์ลิงก์ในโซเชียลมีเดีย, บล็อก, หรือส่งให้เพื่อนโดยตรง 
                  เมื่อมีคนคลิกและซื้อภายใน 30 วัน คุณจะได้ค่าคอมมิชชั่น!
                </div>
              </CardContent>
            </Card>

            {/* Sales History */}
            <Card>
              <CardHeader>
                <CardTitle>ประวัติการขาย</CardTitle>
                <CardDescription>
                  รายการการขายทั้งหมดที่เกิดจากลิงก์ของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSales ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : salesData && salesData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>วันที่</TableHead>
                        <TableHead>ค่าคอมมิชชั่น</TableHead>
                        <TableHead>อัตรา</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>
                            {format(new Date(sale.created_at), 'dd/MM/yyyy HH:mm')}
                          </TableCell>
                          <TableCell className="font-medium">
                            ฿{Number(sale.commission_amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {Math.round(Number(sale.commission_rate) * 100)}%
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(sale.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">ยังไม่มีการขาย</h3>
                    <p className="text-muted-foreground">
                      เริ่มแชร์ลิงก์ของคุณเพื่อสร้างรายได้กันเลย!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AffiliatePage;