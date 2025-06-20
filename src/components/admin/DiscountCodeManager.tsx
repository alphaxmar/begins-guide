
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus, Copy } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface DiscountCode {
  id: string;
  code: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  user_usage_limit: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  applicable_to: string[];
  created_at: string;
}

const DiscountCodeManager = () => {
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: discountCodes, isLoading } = useQuery({
    queryKey: ['discount-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DiscountCode[];
    }
  });

  const createCodeMutation = useMutation({
    mutationFn: async (codeData: Omit<DiscountCode, 'id' | 'created_at' | 'used_count'>) => {
      const { data, error } = await supabase
        .from('discount_codes')
        .insert([{ ...codeData, used_count: 0 }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
      toast.success('สร้างโค้ดส่วนลดสำเร็จ');
      setIsDialogOpen(false);
      setSelectedCode(null);
    },
    onError: (error) => {
      console.error('Error creating discount code:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้างโค้ดส่วนลด');
    }
  });

  const updateCodeMutation = useMutation({
    mutationFn: async ({ id, used_count, created_at, ...codeData }: DiscountCode) => {
      const { data, error } = await supabase
        .from('discount_codes')
        .update(codeData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
      toast.success('อัปเดตโค้ดส่วนลดสำเร็จ');
      setIsDialogOpen(false);
      setSelectedCode(null);
    },
    onError: (error) => {
      console.error('Error updating discount code:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตโค้ดส่วนลด');
    }
  });

  const deleteCodeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
      toast.success('ลบโค้ดส่วนลดสำเร็จ');
    },
    onError: (error) => {
      console.error('Error deleting discount code:', error);
      toast.error('เกิดข้อผิดพลาดในการลบโค้ดส่วนลด');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const applicableToString = formData.get('applicable_to') as string;
    const applicable_to = applicableToString === 'all' ? ['all'] : [applicableToString];
    
    const codeData = {
      code: (formData.get('code') as string).toUpperCase(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      discount_type: formData.get('discount_type') as 'percentage' | 'fixed_amount',
      discount_value: parseFloat(formData.get('discount_value') as string),
      min_purchase_amount: parseFloat(formData.get('min_purchase_amount') as string) || 0,
      max_discount_amount: formData.get('max_discount_amount') ? parseFloat(formData.get('max_discount_amount') as string) : null,
      usage_limit: formData.get('usage_limit') ? parseInt(formData.get('usage_limit') as string) : null,
      user_usage_limit: parseInt(formData.get('user_usage_limit') as string) || 1,
      valid_from: formData.get('valid_from') as string,
      valid_until: formData.get('valid_until') ? formData.get('valid_until') as string : null,
      is_active: formData.get('is_active') === 'on',
      applicable_to
    };

    if (selectedCode) {
      updateCodeMutation.mutate({ ...codeData, id: selectedCode.id, used_count: selectedCode.used_count, created_at: selectedCode.created_at });
    } else {
      createCodeMutation.mutate(codeData);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('คัดลอกโค้ดแล้ว');
  };

  const openCreateDialog = () => {
    setSelectedCode(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (code: DiscountCode) => {
    setSelectedCode(code);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">จัดการโค้ดส่วนลด</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มโค้ดใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCode ? 'แก้ไขโค้ดส่วนลด' : 'เพิ่มโค้ดส่วนลดใหม่'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">โค้ด</Label>
                  <Input
                    id="code"
                    name="code"
                    defaultValue={selectedCode?.code || ''}
                    placeholder="DISCOUNT10"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">ชื่อโค้ด</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedCode?.name || ''}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedCode?.description || ''}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_type">ประเภทส่วนลด</Label>
                  <Select name="discount_type" defaultValue={selectedCode?.discount_type || 'percentage'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">เปอร์เซ็นต์</SelectItem>
                      <SelectItem value="fixed_amount">จำนวนเงิน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount_value">ค่าส่วนลด</Label>
                  <Input
                    id="discount_value"
                    name="discount_value"
                    type="number"
                    step="0.01"
                    defaultValue={selectedCode?.discount_value || ''}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_purchase_amount">ยอดขั้นต่ำ (บาท)</Label>
                  <Input
                    id="min_purchase_amount"
                    name="min_purchase_amount"
                    type="number"
                    step="0.01"
                    defaultValue={selectedCode?.min_purchase_amount || 0}
                  />
                </div>
                <div>
                  <Label htmlFor="max_discount_amount">ส่วนลดสูงสุด (บาท)</Label>
                  <Input
                    id="max_discount_amount"
                    name="max_discount_amount"
                    type="number"
                    step="0.01"
                    defaultValue={selectedCode?.max_discount_amount || ''}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usage_limit">จำนวนครั้งที่ใช้ได้ทั้งหมด</Label>
                  <Input
                    id="usage_limit"
                    name="usage_limit"
                    type="number"
                    defaultValue={selectedCode?.usage_limit || ''}
                    placeholder="ไม่จำกัด"
                  />
                </div>
                <div>
                  <Label htmlFor="user_usage_limit">จำนวนครั้งต่อผู้ใช้</Label>
                  <Input
                    id="user_usage_limit"
                    name="user_usage_limit"
                    type="number"
                    defaultValue={selectedCode?.user_usage_limit || 1}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="applicable_to">ใช้ได้กับ</Label>
                <Select name="applicable_to" defaultValue={selectedCode?.applicable_to?.[0] || 'all'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="vip_packages">แพ็กเกจ VIP</SelectItem>
                    <SelectItem value="courses">คอร์ส</SelectItem>
                    <SelectItem value="templates">เทมเพลต</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">วันที่เริ่มใช้</Label>
                  <Input
                    id="valid_from"
                    name="valid_from"
                    type="datetime-local"
                    defaultValue={selectedCode?.valid_from ? new Date(selectedCode.valid_from).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="valid_until">วันที่หมดอายุ</Label>
                  <Input
                    id="valid_until"
                    name="valid_until"
                    type="datetime-local"
                    defaultValue={selectedCode?.valid_until ? new Date(selectedCode.valid_until).toISOString().slice(0, 16) : ''}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={selectedCode?.is_active ?? true}
                />
                <Label htmlFor="is_active">เปิดใช้งาน</Label>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={createCodeMutation.isPending || updateCodeMutation.isPending}>
                  {selectedCode ? 'อัปเดต' : 'สร้าง'}โค้ด
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
        {discountCodes?.map((code) => (
          <Card key={code.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">{code.code}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code.code)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Badge variant={code.is_active ? 'default' : 'secondary'}>
                      {code.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </Badge>
                  </CardTitle>
                  <p className="text-lg font-medium">{code.name}</p>
                  <p className="text-muted-foreground">{code.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(code)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => deleteCodeMutation.mutate(code.id)}
                    disabled={deleteCodeMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">ส่วนลด</p>
                  <p className="text-green-600 font-bold">
                    {code.discount_type === 'percentage' ? `${code.discount_value}%` : `${code.discount_value.toLocaleString()} บาท`}
                  </p>
                </div>
                <div>
                  <p className="font-medium">ยอดขั้นต่ำ</p>
                  <p>{code.min_purchase_amount.toLocaleString()} บาท</p>
                </div>
                <div>
                  <p className="font-medium">การใช้งาน</p>
                  <p>{code.used_count}/{code.usage_limit || '∞'}</p>
                </div>
                <div>
                  <p className="font-medium">หมดอายุ</p>
                  <p>{code.valid_until ? format(new Date(code.valid_until), 'dd/MM/yyyy') : 'ไม่หมดอายุ'}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <Badge variant="outline">
                  {code.applicable_to[0] === 'all' ? 'ใช้ได้ทั้งหมด' : 
                   code.applicable_to[0] === 'vip_packages' ? 'แพ็กเกจ VIP' :
                   code.applicable_to[0] === 'courses' ? 'คอร์ส' : 'เทมเพลต'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscountCodeManager;
