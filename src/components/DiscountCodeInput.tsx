
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Percent, Tag, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DiscountCode {
  id: string;
  code: string;
  name: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  applicable_to: string[];
}

interface DiscountCodeInputProps {
  cartTotal: number;
  cartItems: Array<{ product_type?: string }>;
  onDiscountApplied: (discount: { code: DiscountCode; discountAmount: number }) => void;
  onDiscountRemoved: () => void;
  appliedDiscount?: { code: DiscountCode; discountAmount: number } | null;
}

const DiscountCodeInput: React.FC<DiscountCodeInputProps> = ({
  cartTotal,
  cartItems,
  onDiscountApplied,
  onDiscountRemoved,
  appliedDiscount
}) => {
  const [discountCode, setDiscountCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      toast.error('กรุณาใส่โค้ดส่วนลด');
      return;
    }

    setIsValidating(true);

    try {
      // ตรวจสอบโค้ดส่วนลด
      const { data: code, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !code) {
        toast.error('โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุแล้ว');
        return;
      }

      // ตรวจสอบวันหมดอายุ
      if (code.valid_until && new Date(code.valid_until) < new Date()) {
        toast.error('โค้ดส่วนลดหมดอายุแล้ว');
        return;
      }

      // ตรวจสอบวันเริ่มใช้
      if (new Date(code.valid_from) > new Date()) {
        toast.error('โค้ดส่วนลดยังไม่สามารถใช้ได้');
        return;
      }

      // ตรวจสอบยอดขั้นต่ำ
      if (cartTotal < code.min_purchase_amount) {
        toast.error(`ยอดซื้อขั้นต่ำ ${code.min_purchase_amount.toLocaleString()} บาท`);
        return;
      }

      // ตรวจสอบว่าใช้ได้กับสินค้าในตะกร้าหรือไม่
      const hasVipPackage = cartItems.some(item => item.product_type === 'vip_package');
      const hasCourses = cartItems.some(item => item.product_type === 'course');
      const hasTemplates = cartItems.some(item => item.product_type === 'template');

      let isApplicable = false;
      if (code.applicable_to.includes('all')) {
        isApplicable = true;
      } else if (code.applicable_to.includes('vip_packages') && hasVipPackage) {
        isApplicable = true;
      } else if (code.applicable_to.includes('courses') && hasCourses) {
        isApplicable = true;
      } else if (code.applicable_to.includes('templates') && hasTemplates) {
        isApplicable = true;
      }

      if (!isApplicable) {
        toast.error('โค้ดส่วนลดนี้ใช้ไม่ได้กับสินค้าในตะกร้า');
        return;
      }

      // ตรวจสอบจำนวนครั้งที่ใช้
      if (code.usage_limit && code.used_count >= code.usage_limit) {
        toast.error('โค้ดส่วนลดถูกใช้หมดแล้ว');
        return;
      }

      // คำนวณส่วนลด
      let discountAmount = 0;
      if (code.discount_type === 'percentage') {
        discountAmount = (cartTotal * code.discount_value) / 100;
        if (code.max_discount_amount) {
          discountAmount = Math.min(discountAmount, code.max_discount_amount);
        }
      } else {
        discountAmount = code.discount_value;
      }

      // ไม่ให้ส่วนลดเกินยอดรวม
      discountAmount = Math.min(discountAmount, cartTotal);

      onDiscountApplied({ code, discountAmount });
      toast.success(`ใช้โค้ดส่วนลดสำเร็จ! ลด ${discountAmount.toLocaleString()} บาท`);
      setDiscountCode('');
    } catch (error) {
      console.error('Error validating discount code:', error);
      toast.error('เกิดข้อผิดพลาดในการตรวจสอบโค้ด');
    } finally {
      setIsValidating(false);
    }
  };

  const removeDiscount = () => {
    onDiscountRemoved();
    toast.success('ยกเลิกการใช้โค้ดส่วนลดแล้ว');
  };

  return (
    <div className="space-y-4">
      {appliedDiscount ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">{appliedDiscount.code.name}</p>
                  <p className="text-sm text-green-600">
                    โค้ด: {appliedDiscount.code.code}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  -{appliedDiscount.discountAmount.toLocaleString()} บาท
                </Badge>
                <Button variant="ghost" size="sm" onClick={removeDiscount}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="discount-code" className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            โค้ดส่วนลด
          </Label>
          <div className="flex gap-2">
            <Input
              id="discount-code"
              placeholder="ใส่โค้ดส่วนลด"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && validateDiscountCode()}
            />
            <Button 
              onClick={validateDiscountCode}
              disabled={isValidating || !discountCode.trim()}
              variant="outline"
            >
              {isValidating ? 'ตรวจสอบ...' : 'ใช้'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCodeInput;
