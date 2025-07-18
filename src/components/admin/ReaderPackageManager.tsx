import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Plus, 
  Edit3, 
  Trash2, 
  Calendar,
  DollarSign,
  Users,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReaderPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  totalSales: number;
  includesBook: boolean;
  aiToolsLimit: number;
}

// Mock data - replace with real API calls
const mockReaderPackages: ReaderPackage[] = [
  {
    id: '1',
    name: 'The Freedom Engine Book',
    description: 'พิมพ์เขียวฉบับเต็มพร้อมเครื่องมือเสริม',
    price: 450,
    originalPrice: 990,
    features: [
      'หนังสือ "The Freedom Engine" ฉบับเต็ม',
      'Case Study พิเศษ 5 เรื่อง',
      'เข้าถึง Community Board',
      'AI Tools ทดลอง 10 ครั้ง'
    ],
    status: 'active',
    createdAt: '2024-01-15',
    totalSales: 890,
    includesBook: true,
    aiToolsLimit: 10
  },
  {
    id: '2',
    name: 'Reader Plus Package',
    description: 'แพ็กเกจ Reader พร้อมโบนัสพิเศษ',
    price: 650,
    originalPrice: 1290,
    features: [
      'ทุกอย่างใน Freedom Engine Book',
      'Bonus Case Study เพิ่ม 3 เรื่อง',
      'Template ธุรกิจ 5 ชุด',
      'AI Tools ทดลอง 20 ครั้ง'
    ],
    status: 'active',
    createdAt: '2024-02-01',
    totalSales: 245,
    includesBook: true,
    aiToolsLimit: 20
  },
  {
    id: '3',
    name: 'Reader Starter Kit',
    description: 'แพ็กเกจเริ่มต้นสำหรับ Reader ใหม่',
    price: 299,
    originalPrice: 599,
    features: [
      'หนังสือ "The Freedom Engine" (ดิจิทัล)',
      'Quick Start Guide',
      'Community Access',
      'AI Tools ทดลอง 5 ครั้ง'
    ],
    status: 'draft',
    createdAt: '2024-03-01',
    totalSales: 0,
    includesBook: true,
    aiToolsLimit: 5
  }
];

const ReaderPackageManager = () => {
  const { toast } = useToast();
  const [packages, setPackages] = useState<ReaderPackage[]>(mockReaderPackages);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ReaderPackage | null>(null);
  
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    features: [''],
    aiToolsLimit: 10,
    includesBook: true
  });

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.description || newPackage.price <= 0) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }

    const packageData: ReaderPackage = {
      id: Date.now().toString(),
      name: newPackage.name,
      description: newPackage.description,
      price: newPackage.price,
      originalPrice: newPackage.originalPrice || undefined,
      features: newPackage.features.filter(f => f.trim() !== ''),
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      totalSales: 0,
      includesBook: newPackage.includesBook,
      aiToolsLimit: newPackage.aiToolsLimit
    };

    setPackages([...packages, packageData]);
    setNewPackage({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      features: [''],
      aiToolsLimit: 10,
      includesBook: true
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "เพิ่มแพ็กเกจสำเร็จ",
      description: `เพิ่ม ${packageData.name} แล้ว`,
    });
  };

  const handleUpdatePackage = (updatedPackage: ReaderPackage) => {
    setPackages(packages.map(pkg =>
      pkg.id === updatedPackage.id ? updatedPackage : pkg
    ));
    setEditingPackage(null);
    
    toast({
      title: "อัปเดตแพ็กเกจสำเร็จ",
      description: `อัปเดต ${updatedPackage.name} แล้ว`,
    });
  };

  const handleDeletePackage = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    setPackages(packages.filter(p => p.id !== packageId));
    
    toast({
      title: "ลบแพ็กเกจสำเร็จ",
      description: `ลบ ${pkg?.name} ออกจากระบบแล้ว`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: 'เปิดใช้งาน',
      inactive: 'ปิดใช้งาน',
      draft: 'ร่าง'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const addFeature = () => {
    setNewPackage({
      ...newPackage,
      features: [...newPackage.features, '']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...newPackage.features];
    updatedFeatures[index] = value;
    setNewPackage({
      ...newPackage,
      features: updatedFeatures
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = newPackage.features.filter((_, i) => i !== index);
    setNewPackage({
      ...newPackage,
      features: updatedFeatures
    });
  };

  const totalRevenue = packages.reduce((sum, pkg) => sum + (pkg.price * pkg.totalSales), 0);
  const totalSales = packages.reduce((sum, pkg) => sum + pkg.totalSales, 0);
  const activePackages = packages.filter(pkg => pkg.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">แพ็กเกจทั้งหมด</p>
                <p className="text-2xl font-bold">{packages.length}</p>
              </div>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">กำลังใช้งาน</p>
                <p className="text-2xl font-bold text-green-600">{activePackages}</p>
              </div>
              <Star className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ยอดขายรวม</p>
                <p className="text-2xl font-bold">{totalSales.toLocaleString()}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
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
                <BookOpen className="h-5 w-5" />
                จัดการแพ็กเกจ Reader
              </CardTitle>
              <CardDescription>
                จัดการแพ็กเกจหนังสือและเนื้อหาสำหรับสมาชิก Reader Level
              </CardDescription>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มแพ็กเกจใหม่
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>เพิ่มแพ็กเกจ Reader ใหม่</DialogTitle>
                  <DialogDescription>
                    สร้างแพ็กเกจใหม่สำหรับสมาชิก Reader
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <Label htmlFor="name">ชื่อแพ็กเกจ</Label>
                    <Input
                      id="name"
                      value={newPackage.name}
                      onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                      placeholder="เช่น The Freedom Engine Book"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">คำอธิบาย</Label>
                    <Textarea
                      id="description"
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                      placeholder="อธิบายเกี่ยวกับแพ็กเกจนี้"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">ราคา (บาท)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newPackage.price}
                        onChange={(e) => setNewPackage({ ...newPackage, price: parseInt(e.target.value) })}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">ราคาเดิม (บาท)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={newPackage.originalPrice}
                        onChange={(e) => setNewPackage({ ...newPackage, originalPrice: parseInt(e.target.value) })}
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="aiLimit">จำนวน AI Tools ที่ใช้ได้</Label>
                    <Input
                      id="aiLimit"
                      type="number"
                      value={newPackage.aiToolsLimit}
                      onChange={(e) => setNewPackage({ ...newPackage, aiToolsLimit: parseInt(e.target.value) })}
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <Label>ฟีเจอร์ในแพ็กเกจ</Label>
                    {newPackage.features.map((feature, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder={`ฟีเจอร์ที่ ${index + 1}`}
                        />
                        {newPackage.features.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeature(index)}
                          >
                            ลบ
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFeature}
                      className="mt-2"
                    >
                      + เพิ่มฟีเจอร์
                    </Button>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      ยกเลิก
                    </Button>
                    <Button onClick={handleAddPackage}>
                      เพิ่มแพ็กเกจ
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
              placeholder="ค้นหาแพ็กเกจ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Packages Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>แพ็กเกจ</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>ยอดขาย</TableHead>
                <TableHead>AI Tools</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{pkg.name}</div>
                      <div className="text-sm text-gray-500">{pkg.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {pkg.features.length} ฟีเจอร์
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">฿{pkg.price.toLocaleString()}</span>
                      {pkg.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ฿{pkg.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{pkg.totalSales.toLocaleString()} คน</span>
                      <span className="text-xs text-gray-500">
                        ฿{(pkg.price * pkg.totalSales).toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {pkg.aiToolsLimit} ครั้ง
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(pkg.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPackage(pkg)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePackage(pkg.id)}
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

      {/* Edit Package Dialog */}
      {editingPackage && (
        <Dialog open={!!editingPackage} onOpenChange={() => setEditingPackage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>แก้ไขแพ็กเกจ Reader</DialogTitle>
              <DialogDescription>
                แก้ไขรายละเอียดของ {editingPackage.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="edit-name">ชื่อแพ็กเกจ</Label>
                <Input
                  id="edit-name"
                  value={editingPackage.name}
                  onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">คำอธิบาย</Label>
                <Textarea
                  id="edit-description"
                  value={editingPackage.description}
                  onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">ราคา (บาท)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingPackage.price}
                    onChange={(e) => setEditingPackage({ ...editingPackage, price: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">สถานะ</Label>
                  <select
                    id="edit-status"
                    value={editingPackage.status}
                    onChange={(e) => setEditingPackage({ ...editingPackage, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">เปิดใช้งาน</option>
                    <option value="inactive">ปิดใช้งาน</option>
                    <option value="draft">ร่าง</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-ai-limit">จำนวน AI Tools ที่ใช้ได้</Label>
                <Input
                  id="edit-ai-limit"
                  type="number"
                  value={editingPackage.aiToolsLimit}
                  onChange={(e) => setEditingPackage({ ...editingPackage, aiToolsLimit: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingPackage(null)}>
                  ยกเลิก
                </Button>
                <Button onClick={() => handleUpdatePackage(editingPackage)}>
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

export default ReaderPackageManager;
