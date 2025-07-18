import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Star, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar,
  DollarSign,
  Users,
  Crown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CircleMember {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  totalSpent: number;
  membershipType: 'annual' | 'lifetime';
  nextBilling?: string;
  specialPerks: string[];
}

// Mock data - replace with real API calls
const mockCircleMembers: CircleMember[] = [
  {
    id: '1',
    name: 'นางสาวสมใจ ธุรกิจดี',
    email: 'somjai@example.com',
    joinDate: '2024-01-15',
    status: 'active',
    totalSpent: 29990,
    membershipType: 'annual',
    nextBilling: '2025-01-15',
    specialPerks: ['1-on-1 Coaching', 'VIP Event Access', 'Direct Line Support']
  },
  {
    id: '2',
    name: 'นายประสิทธิ์ เจริญธุรกิจ',
    email: 'prasit@example.com',
    joinDate: '2024-02-01',
    status: 'active',
    totalSpent: 99990,
    membershipType: 'lifetime',
    specialPerks: ['Lifetime Access', 'Private Mastermind', 'Investment Opportunities']
  },
  {
    id: '3',
    name: 'คุณวิมล ผู้ประกอบการ',
    email: 'wimon@example.com',
    joinDate: '2024-03-01',
    status: 'pending',
    totalSpent: 9990,
    membershipType: 'annual',
    nextBilling: '2025-03-01',
    specialPerks: ['Circle Community', 'Monthly Calls', 'Resource Library']
  }
];

const CircleMembershipManager = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<CircleMember[]>(mockCircleMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CircleMember | null>(null);
  
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    membershipType: 'annual' as 'annual' | 'lifetime'
  });

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกชื่อและอีเมล",
        variant: "destructive",
      });
      return;
    }

    const memberData: CircleMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      totalSpent: 0,
      membershipType: newMember.membershipType,
      nextBilling: newMember.membershipType === 'annual' ? 
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      specialPerks: ['Circle Community Access']
    };

    setMembers([...members, memberData]);
    setNewMember({ name: '', email: '', membershipType: 'annual' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "เพิ่มสมาชิกสำเร็จ",
      description: `เพิ่ม ${memberData.name} เข้าระบบแล้ว`,
    });
  };

  const handleUpdateMember = (updatedMember: CircleMember) => {
    setMembers(members.map(member =>
      member.id === updatedMember.id ? updatedMember : member
    ));
    setEditingMember(null);
    
    toast({
      title: "อัปเดตสมาชิกสำเร็จ",
      description: `อัปเดต ${updatedMember.name} แล้ว`,
    });
  };

  const handleDeleteMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    setMembers(members.filter(m => m.id !== memberId));
    
    toast({
      title: "ลบสมาชิกสำเร็จ",
      description: `ลบ ${member?.name} ออกจากระบบแล้ว`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: 'ใช้งานอยู่',
      inactive: 'ไม่ใช้งาน',
      pending: 'รอดำเนินการ'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getMembershipTypeBadge = (type: string) => {
    const variants = {
      annual: 'bg-blue-100 text-blue-800',
      lifetime: 'bg-purple-100 text-purple-800'
    };
    
    const labels = {
      annual: 'รายปี',
      lifetime: 'ตลอดชีพ'
    };

    return (
      <Badge className={variants[type as keyof typeof variants]}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  const totalRevenue = members.reduce((sum, member) => sum + member.totalSpent, 0);
  const activeMembers = members.filter(member => member.status === 'active').length;
  const lifetimeMembers = members.filter(member => member.membershipType === 'lifetime').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">สมาชิกทั้งหมด</p>
                <p className="text-2xl font-bold">{members.length}</p>
              </div>
              <Star className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ใช้งานอยู่</p>
                <p className="text-2xl font-bold text-green-600">{activeMembers}</p>
              </div>
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">สมาชิกตลอดชีพ</p>
                <p className="text-2xl font-bold text-purple-600">{lifetimeMembers}</p>
              </div>
              <Crown className="h-4 w-4 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">รายได้รวม</p>
                <p className="text-2xl font-bold">฿{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                จัดการสมาชิก Circle Level
              </CardTitle>
              <CardDescription>
                จัดการสมาชิกระดับสูงสุดในระบบ Value Ladder พร้อมสิทธิพิเศษครบครัน
              </CardDescription>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มสมาชิกใหม่
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มสมาชิก Circle Level</DialogTitle>
                  <DialogDescription>
                    เพิ่มสมาชิกใหม่เข้าสู่ระดับสูงสุดของ Value Ladder
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                    <Input
                      id="name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">อีเมล</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="กรอกอีเมล"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="membershipType">ประเภทสมาชิก</Label>
                    <select
                      id="membershipType"
                      value={newMember.membershipType}
                      onChange={(e) => setNewMember({ ...newMember, membershipType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="annual">รายปี (฿9,990)</option>
                      <option value="lifetime">ตลอดชีพ (฿29,990)</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      ยกเลิก
                    </Button>
                    <Button onClick={handleAddMember}>
                      เพิ่มสมาชิก
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="ค้นหาสมาชิก..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Members Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>สมาชิก</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>ยอดใช้จ่าย</TableHead>
                <TableHead>วันหมดอายุ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        เข้าร่วม: {member.joinDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getMembershipTypeBadge(member.membershipType)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">฿{member.totalSpent.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    {member.nextBilling ? (
                      <span className="text-sm">{member.nextBilling}</span>
                    ) : (
                      <Badge variant="outline">ตลอดชีพ</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(member.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMember(member)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>แก้ไขสมาชิก Circle</DialogTitle>
              <DialogDescription>
                แก้ไขข้อมูลของ {editingMember.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">ชื่อ-นามสกุล</Label>
                <Input
                  id="edit-name"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-email">อีเมล</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-status">สถานะ</Label>
                <select
                  id="edit-status"
                  value={editingMember.status}
                  onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="active">ใช้งานอยู่</option>
                  <option value="inactive">ไม่ใช้งาน</option>
                  <option value="pending">รอดำเนินการ</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="edit-type">ประเภทสมาชิก</Label>
                <select
                  id="edit-type"
                  value={editingMember.membershipType}
                  onChange={(e) => setEditingMember({ ...editingMember, membershipType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="annual">รายปี</option>
                  <option value="lifetime">ตลอดชีพ</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingMember(null)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => handleUpdateMember(editingMember)}>
                  บันทึกการเปลี่ยนแปลง
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CircleMembershipManager;
