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
  BookOpen, 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Calendar,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReaderMember {
  id: string;
  email: string;
  name: string;
  purchaseDate: string;
  status: 'active' | 'expired' | 'refunded';
  bookAccess: boolean;
  aiToolsUsed: number;
  aiToolsLimit: number;
  totalSpent: number;
}

// Mock data - replace with real API calls
const mockReaderMembers: ReaderMember[] = [
  {
    id: '1',
    email: 'reader1@example.com',
    name: 'สมชาย ใจดี',
    purchaseDate: '2024-01-15',
    status: 'active',
    bookAccess: true,
    aiToolsUsed: 7,
    aiToolsLimit: 10,
    totalSpent: 450
  },
  {
    id: '2',
    email: 'reader2@example.com',
    name: 'สมหญิง รักดี',
    purchaseDate: '2024-02-20',
    status: 'active',
    bookAccess: true,
    aiToolsUsed: 10,
    aiToolsLimit: 10,
    totalSpent: 450
  },
  {
    id: '3',
    email: 'reader3@example.com',
    name: 'วิชาญ เก่งดี',
    purchaseDate: '2024-01-10',
    status: 'expired',
    bookAccess: false,
    aiToolsUsed: 5,
    aiToolsLimit: 10,
    totalSpent: 450
  }
];

const ReaderMembershipManager = () => {
  const { toast } = useToast();
  const [readerMembers, setReaderMembers] = useState<ReaderMember[]>(mockReaderMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ReaderMember | null>(null);
  
  const [newMember, setNewMember] = useState({
    email: '',
    name: '',
    bookAccess: true,
    aiToolsLimit: 10
  });

  const filteredMembers = readerMembers.filter(member =>
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    if (!newMember.email || !newMember.name) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกอีเมลและชื่อ",
        variant: "destructive",
      });
      return;
    }

    const member: ReaderMember = {
      id: Date.now().toString(),
      email: newMember.email,
      name: newMember.name,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'active',
      bookAccess: newMember.bookAccess,
      aiToolsUsed: 0,
      aiToolsLimit: newMember.aiToolsLimit,
      totalSpent: 450
    };

    setReaderMembers([...readerMembers, member]);
    setNewMember({ email: '', name: '', bookAccess: true, aiToolsLimit: 10 });
    setIsAddDialogOpen(false);
    
    toast({
      title: "เพิ่มสมาชิก Reader สำเร็จ",
      description: `เพิ่ม ${member.name} เป็นสมาชิก Reader แล้ว`,
    });
  };

  const handleUpdateMember = (updatedMember: ReaderMember) => {
    setReaderMembers(readerMembers.map(member =>
      member.id === updatedMember.id ? updatedMember : member
    ));
    setEditingMember(null);
    
    toast({
      title: "อัปเดตข้อมูลสำเร็จ",
      description: `อัปเดตข้อมูล ${updatedMember.name} แล้ว`,
    });
  };

  const handleDeleteMember = (memberId: string) => {
    const member = readerMembers.find(m => m.id === memberId);
    setReaderMembers(readerMembers.filter(m => m.id !== memberId));
    
    toast({
      title: "ลบสมาชิกสำเร็จ",
      description: `ลบ ${member?.name} ออกจากระบบแล้ว`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      active: 'ใช้งานอยู่',
      expired: 'หมดอายุ',
      refunded: 'คืนเงินแล้ว'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const totalActiveMembers = readerMembers.filter(m => m.status === 'active').length;
  const totalRevenue = readerMembers.reduce((sum, m) => sum + m.totalSpent, 0);
  const avgAiUsage = readerMembers.reduce((sum, m) => sum + (m.aiToolsUsed / m.aiToolsLimit), 0) / readerMembers.length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">สมาชิก Reader ทั้งหมด</p>
                <p className="text-2xl font-bold">{readerMembers.length}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">กำลังใช้งาน</p>
                <p className="text-2xl font-bold text-green-600">{totalActiveMembers}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">การใช้ AI เฉลี่ย</p>
                <p className="text-2xl font-bold">{(avgAiUsage * 100).toFixed(0)}%</p>
              </div>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
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
                <BookOpen className="h-5 w-5" />
                จัดการสมาชิก Reader
              </CardTitle>
              <CardDescription>
                จัดการผู้ซื้อหนังสือและสิทธิ์การเข้าถึงระดับ Reader
              </CardDescription>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  เพิ่มสมาชิก Reader
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มสมาชิก Reader ใหม่</DialogTitle>
                  <DialogDescription>
                    เพิ่มสมาชิกใหม่เข้าสู่ระดับ Reader และให้สิทธิ์การเข้าถึงหนังสือ
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">อีเมล</Label>
                    <Input
                      id="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="reader@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                    <Input
                      id="name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="ชื่อสมาชิก"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="aiLimit">จำนวน AI Tools ที่ใช้ได้</Label>
                    <Input
                      id="aiLimit"
                      type="number"
                      value={newMember.aiToolsLimit}
                      onChange={(e) => setNewMember({ ...newMember, aiToolsLimit: parseInt(e.target.value) })}
                      min="0"
                      max="50"
                    />
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
              placeholder="ค้นหาด้วยอีเมลหรือชื่อ..."
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
                <TableHead>วันที่ซื้อ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>AI Tools</TableHead>
                <TableHead>ยอดรวม</TableHead>
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
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(member.purchaseDate).toLocaleDateString('th-TH')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(member.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        {member.aiToolsUsed}/{member.aiToolsLimit}
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(member.aiToolsUsed / member.aiToolsLimit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    ฿{member.totalSpent.toLocaleString()}
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
              <DialogTitle>แก้ไขข้อมูลสมาชิก Reader</DialogTitle>
              <DialogDescription>
                แก้ไขข้อมูลและสิทธิ์การเข้าถึงของ {editingMember.name}
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
                <Label htmlFor="edit-status">สถานะ</Label>
                <select
                  id="edit-status"
                  value={editingMember.status}
                  onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="active">ใช้งานอยู่</option>
                  <option value="expired">หมดอายุ</option>
                  <option value="refunded">คืนเงินแล้ว</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="edit-ai-limit">จำนวน AI Tools ที่ใช้ได้</Label>
                <Input
                  id="edit-ai-limit"
                  type="number"
                  value={editingMember.aiToolsLimit}
                  onChange={(e) => setEditingMember({ ...editingMember, aiToolsLimit: parseInt(e.target.value) })}
                  min="0"
                  max="50"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-ai-used">AI Tools ที่ใช้แล้ว</Label>
                <Input
                  id="edit-ai-used"
                  type="number"
                  value={editingMember.aiToolsUsed}
                  onChange={(e) => setEditingMember({ ...editingMember, aiToolsUsed: parseInt(e.target.value) })}
                  min="0"
                  max={editingMember.aiToolsLimit}
                />
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

export default ReaderMembershipManager;
