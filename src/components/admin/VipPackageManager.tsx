
import React, { useState } from 'react';
import { useVipPackages, useVipPackageMutations } from '@/hooks/useVipPackages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Crown } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface VipPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_months: number | null;
  features: string[];
  is_active: boolean;
  created_at: string;
}

const VipPackageManager = () => {
  const [selectedPackage, setSelectedPackage] = useState<VipPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: packages, isLoading } = useVipPackages();
  const { createPackage, updatePackage, deletePackage } = useVipPackageMutations();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const featuresText = formData.get('features') as string;
    const features = featuresText.split('\n').filter(f => f.trim());
    
    const packageData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      duration_months: formData.get('duration_months') ? parseInt(formData.get('duration_months') as string) : null,
      features,
      is_active: formData.get('is_active') === 'on'
    };

    if (selectedPackage) {
      updatePackage.mutate({ 
        ...packageData, 
        id: selectedPackage.id, 
        created_at: selectedPackage.created_at 
      }, {
        onSuccess: () => {
          toast.success('อัปเดตแพ็กเกจ VIP สำเร็จ');
          setIsDialogOpen(false);
          setSelectedPackage(null);
        },
        onError: () => {
          toast.error('เกิดข้อผิดพลาดในการอัปเดตแพ็กเกจ');
        }
      });
    } else {
      createPackage.mutate(packageData, {
        onSuccess: () => {
          toast.success('สร้างแพ็กเกจ VIP สำเร็จ');
          setIsDialogOpen(false);
          setSelectedPackage(null);
        },
        onError: () => {
          toast.error('เกิดข้อผิดพลาดในการสร้างแพ็กเกจ');
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบแพ็กเกจนี้?')) {
      deletePackage.mutate(id, {
        onSuccess: () => {
          toast.success('ลบแพ็กเกจ VIP สำเร็จ');
        },
        onError: () => {
          toast.error('เกิดข้อผิดพลาดในการลบแพ็กเกจ');
        }
      });
    }
  };

  const openCreateDialog = () => {
    setSelectedPackage(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (pkg: VipPackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-600" />
            จัดการแพ็กเกจ VIP
          </h2>
          <p className="text-muted-foreground mt-1">
            สร้าง แก้ไข และจัดการแพ็กเกจ VIP สำหรับลูกค้า
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มแพ็กเกจใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                {selectedPackage ? 'แก้ไขแพ็กเกจ VIP' : 'เพิ่มแพ็กเกจ VIP ใหม่'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">ชื่อแพ็กเกจ</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={selectedPackage?.name || ''}
                  placeholder="เช่น แพ็กเกจ VIP Premium"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedPackage?.description || ''}
                  placeholder="คำอธิบายแพ็กเกจ VIP"
                />
              </div>
              
              <div>
                <Label htmlFor="price">ราคา (บาท)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={selectedPackage?.price || ''}
                  placeholder="2999"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="duration_months">
                  ระยะเวลา (เดือน) 
                  <span className="text-sm text-muted-foreground ml-1">
                    - ปล่อยว่างสำหรับ Lifetime
                  </span>
                </Label>
                <Input
                  id="duration_months"
                  name="duration_months"
                  type="number"
                  defaultValue={selectedPackage?.duration_months || ''}
                  placeholder="ปล่อยว่างสำหรับตลอดชีวิต"
                />
              </div>
              
              <div>
                <Label htmlFor="features">
                  ฟีเจอร์ที่คุณจะได้รับ 
                  <span className="text-sm text-muted-foreground ml-1">
                    (แต่ละบรรทัด)
                  </span>
                </Label>
                <Textarea
                  id="features"
                  name="features"
                  defaultValue={selectedPackage?.features?.join('\n') || ''}
                  placeholder="เข้าถึงคอร์สออนไลน์ทั้งหมด&#10;ดาวน์โหลดเทมเพลตทั้งหมด&#10;อัปเดตเนื้อหาใหม่ฟรี&#10;สนับสนุนลูกค้า VIP&#10;เข้าถึงเนื้อหาพิเศษ"
                  rows={6}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={selectedPackage?.is_active ?? true}
                />
                <Label htmlFor="is_active">เปิดใช้งาน</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={createPackage.isPending || updatePackage.isPending}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {selectedPackage ? 'อัปเดต' : 'สร้าง'}แพ็กเกจ
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  ยกเลิก
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {packages && packages.length > 0 ? packages.map((pkg) => (
          <Card key={pkg.id} className="border-2 border-yellow-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    {pkg.name}
                    <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                      {pkg.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </Badge>
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">{pkg.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(pkg)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(pkg.id)}
                    disabled={deletePackage.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-yellow-600">
                    {pkg.price.toLocaleString()}
                  </p>
                  <span className="text-lg text-muted-foreground">บาท</span>
                  <Badge variant="outline" className="ml-2">
                    {pkg.duration_months ? `${pkg.duration_months} เดือน` : 'ตลอดชีวิต'}
                  </Badge>
                </div>
                
                {pkg.features && pkg.features.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2 text-gray-900">ที่คุณจะได้รับ:</p>
                    <ul className="space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-8 text-center">
              <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">ยังไม่มีแพ็กเกจ VIP</p>
              <p className="text-sm text-muted-foreground mt-1">
                คลิก "เพิ่มแพ็กเกจใหม่" เพื่อเริ่มสร้างแพ็กเกจ VIP แรกของคุณ
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VipPackageManager;
