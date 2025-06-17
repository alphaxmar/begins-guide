
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Loader2, 
  Search, 
  Settings, 
  Users, 
  RefreshCw,
  Download,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Crown
} from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import UserRoleDialog from '@/components/admin/UserRoleDialog';
import { toast } from 'sonner';

const AdminUsersPage = () => {
  const { data: users, isLoading, error, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  // Filtered users with better search logic
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Statistics for dashboard overview
  const stats = users ? {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    partners: users.filter(u => u.role === 'partner').length,
    users: users.filter(u => u.role === 'user').length,
    totalRevenue: users.reduce((sum, u) => sum + (u.total_spent || 0), 0),
  } : null;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'partner':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'ผู้ดูแลระบบ';
      case 'partner':
        return 'พาร์ทเนอร์';
      default:
        return 'ผู้ใช้ทั่วไป';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'partner':
        return <UserCheck className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('รีเฟรชข้อมูลผู้ใช้สำเร็จ');
  };

  const exportToCSV = () => {
    if (!filteredUsers?.length) {
      toast.error('ไม่มีข้อมูลสำหรับ Export');
      return;
    }

    const csvData = filteredUsers.map(user => ({
      'ชื่อ-นามสกุล': user.full_name || 'ไม่ระบุ',
      'อีเมล': user.email,
      'สิทธิ์': getRoleDisplayName(user.role),
      'วันที่สมัคร': formatDate(user.created_at),
      'จำนวนการซื้อ': user.total_purchases,
      'ยอดรวม': user.total_spent,
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Export ข้อมูลผู้ใช้สำเร็จ');
  };

  if (error) {
    return (
      <div className="py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                เกิดข้อผิดพลาดในการโหลดข้อมูล
              </h3>
              <p className="text-muted-foreground mb-4">
                {error.message}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                ลองใหม่อีกครั้ง
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            จัดการผู้ใช้
          </h1>
          <p className="text-muted-foreground mt-2">
            ดูและจัดการข้อมูลผู้ใช้งานทั้งหมดในระบบ
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            รีเฟรช
          </Button>
          <Button onClick={exportToCSV} variant="outline" size="sm" disabled={!filteredUsers?.length}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                  <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Crown className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">ผู้ดูแลระบบ</p>
                  <p className="text-2xl font-bold">{stats.admins}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">พาร์ทเนอร์</p>
                  <p className="text-2xl font-bold">{stats.partners}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">ยอดขายรวม</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>รายชื่อผู้ใช้ทั้งหมด</CardTitle>
          <CardDescription>
            ค้นหาและกรองผู้ใช้ตามความต้องการ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ค้นหาจากชื่อหรืออีเมล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="กรองตามสิทธิ์" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสิทธิ์</SelectItem>
                <SelectItem value="user">ผู้ใช้ทั่วไป</SelectItem>
                <SelectItem value="partner">พาร์ทเนอร์</SelectItem>
                <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">กำลังโหลดข้อมูลผู้ใช้...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อ-นามสกุล</TableHead>
                      <TableHead>อีเมล</TableHead>
                      <TableHead>สิทธิ์</TableHead>
                      <TableHead>วันที่สมัคร</TableHead>
                      <TableHead className="text-right">จำนวนการซื้อ</TableHead>
                      <TableHead className="text-right">ยอดรวม</TableHead>
                      <TableHead className="text-center">การกระทำ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">ไม่พบผู้ใช้ที่ตรงกับการค้นหา</p>
                            <p className="text-muted-foreground">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers?.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {user.full_name || 'ไม่ระบุ'}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                              {getRoleIcon(user.role)}
                              {getRoleDisplayName(user.role)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell className="text-right font-medium">
                            {user.total_purchases}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(user.total_spent)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              จัดการ
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredUsers && filteredUsers.length > 0 && (
                <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                  <span>แสดง {filteredUsers.length} จาก {users?.length} ผู้ใช้</span>
                  {filteredUsers.length !== users?.length && (
                    <span>กรองแล้ว</span>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UserRoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        user={selectedUser}
      />
    </div>
  );
};

export default AdminUsersPage;
