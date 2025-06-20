
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus } from 'lucide-react';
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
  const [packages, setPackages] = useState<VipPackage[]>([]);
  const queryClient = useQueryClient();

  // For now, we'll manage packages in local state until the migration is complete
  const { isLoading } = useQuery({
    queryKey: ['vip-packages-temp'],
    queryFn: async () => {
      // Return empty array for now
      return [];
    }
  });

  const createPackageMutation = useMutation({
    mutationFn: async (packageData: Omit<VipPackage, 'id' | 'created_at'>) => {
      // For now, create a local package
      const newPackage: VipPackage = {
        ...packageData,
        id: `vip-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      setPackages(prev => [...prev, newPackage]);
      return newPackage;
    },
    onSuccess: () => {
      toast.success('สร้างแพ็กเกจ VIP สำเร็จ');
      setIsDialogOpen(false);
      setSelectedPackage(null);
    },
    onError: (error) => {
      console.error('Error creating package:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้างแพ็กเกจ');
    }
  });

  const updatePackageMutation = useMutation({
    mutationFn: async (updatedPackage: VipPackage) => {
      setPackages(prev => prev.map(pkg => pkg.id === updatedPackage.id ? updatedPackage : pkg));
      return updatedPackage;
    },
    onSuccess: () => {
      toast.success('อัปเดตแพ็กเกจ VIP สำเร็จ');
      setIsDialogOpen(false);
      setSelectedPackage(null);
    },
    onError: (error) => {
      console.error('Error updating package:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตแพ็กเกจ');
    }
  });

  const deletePackageMutation = useMutation({
    mutationFn: async (id: string) => {
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
    },
    onSuccess: () => {
      toast.success('ลบแพ็กเกจ VIP สำเร็จ');
    },
    onError: (error) => {
      console.error('Error deleting package:', error);
      toast.error('เกิดข้อผิดพลาดในการลบแพ็กเกจ');
    }
  });

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
      updatePackageMutation.mutate({ 
        ...packageData, 
        id: selectedPackage.id, 
        created_at: selectedPackage.created_at 
      });
    } else {
      createPackageMutation.mutate(packageData);
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
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">จัดการแพ็กเกจ VIP</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มแพ็กเกจใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
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
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedPackage?.description || ''}
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
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="duration_months">ระยะเวลา (เดือน) - ปล่อยว่างสำหรับ Lifetime</Label>
                <Input
                  id="duration_months"
                  name="duration_months"
                  type="number"
                  defaultValue={selectedPackage?.duration_months || ''}
                />
              </div>
              
              <div>
                <Label htmlFor="features">ฟีเจอร์ (แต่ละบรรทัด)</Label>
                <Textarea
                  id="features"
                  name="features"
                  defaultValue={selectedPackage?.features?.join('\n') || ''}
                  placeholder="เข้าถึงคอร์สทั้งหมด&#10;เข้าถึงเทมเพลตทั้งหมด&#10;อัปเดตเนื้อหาใหม่ฟรี"
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
              
              <div className="flex gap-2">
                <Button type="submit" disabled={createPackageMutation.isPending || updatePackageMutation.isPending}>
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
        {packages?.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {pkg.name}
                    <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                      {pkg.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </Badge>
                  </CardTitle>
                  <p className="text-muted-foreground">{pkg.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(pkg)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deletePackageMutation.mutate(pkg.id)}
                    disabled={deletePackageMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-600">
                  {pkg.price.toLocaleString()} บาท
                </p>
                <p className="text-sm text-muted-foreground">
                  {pkg.duration_months ? `${pkg.duration_months} เดือน` : 'ตลอดชีวิต'}
                </p>
                {pkg.features && pkg.features.length > 0 && (
                  <div>
                    <p className="font-medium mb-1">ฟีเจอร์:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {packages.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">ยังไม่มีแพ็กเกจ VIP</p>
              <p className="text-sm text-muted-foreground mt-1">คลิก "เพิ่มแพ็กเกจใหม่" เพื่อเริ่มสร้างแพ็กเกจ VIP</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VipPackageManager;
