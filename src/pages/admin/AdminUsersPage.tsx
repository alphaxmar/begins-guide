
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUsers, useUpdateUserRole } from "@/hooks/useUsers";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageHeader } from "@/components/ui/page-header";
import { Search, UserCheck, Shield, Crown } from "lucide-react";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import UserRoleDialog from '@/components/admin/UserRoleDialog';

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const { data: users, isLoading } = useUsers();
  const updateUserRole = useUpdateUserRole();

  const filteredUsers = users?.filter(user => {
    const matchesSearch = !searchQuery || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'partner': return 'bg-blue-100 text-blue-800';
      case 'vip': return 'bg-yellow-100 text-yellow-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'partner': return <UserCheck className="h-4 w-4" />;
      case 'vip': return <Crown className="h-4 w-4" />;
      case 'user': return <UserCheck className="h-4 w-4" />;
      default: return <UserCheck className="h-4 w-4" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'ผู้ดูแลระบบ';
      case 'partner': return 'พาร์ทเนอร์';
      case 'vip': return 'สมาชิก VIP';
      case 'user': return 'ผู้ใช้ทั่วไป';
      default: return role;
    }
  };

  const handleRoleChange = (userId: string, newRole: 'user' | 'admin' | 'partner' | 'vip') => {
    updateUserRole.mutate({ userId, newRole });
  };

  const openRoleDialog = (user: any) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  return (
    <div className="py-8">
      <PageHeader 
        title="จัดการผู้ใช้งาน"
        description="ดูและจัดการข้อมูลผู้ใช้งานในระบบ"
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="ค้นหาจากอีเมลหรือชื่อ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="กรองตามสิทธิ์" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสิทธิ์</SelectItem>
            <SelectItem value="user">ผู้ใช้ทั่วไป</SelectItem>
            <SelectItem value="partner">พาร์ทเนอร์</SelectItem>
            <SelectItem value="vip">สมาชิก VIP</SelectItem>
            <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายการผู้ใช้งาน ({filteredUsers?.length || 0} คน)</CardTitle>
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
                  <TableHead>ผู้ใช้งาน</TableHead>
                  <TableHead>สิทธิ์</TableHead>
                  <TableHead>สถิติการซื้อ</TableHead>
                  <TableHead>วันที่สมัคร</TableHead>
                  <TableHead>การจัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.full_name || 'ไม่ระบุชื่อ'}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{getRoleText(user.role)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.total_purchases} ครั้ง</div>
                        <div className="text-muted-foreground">
                          ฿{Number(user.total_spent).toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'dd MMM yyyy', { locale: th })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRoleDialog(user)}
                      >
                        เปลี่ยนสิทธิ์
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {filteredUsers && filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              ไม่พบผู้ใช้งานที่ตรงกับเงื่อนไข
            </div>
          )}
        </CardContent>
      </Card>

      <UserRoleDialog
        user={selectedUser}
        isOpen={isRoleDialogOpen}
        onClose={() => setIsRoleDialogOpen(false)}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default AdminUsersPage;
