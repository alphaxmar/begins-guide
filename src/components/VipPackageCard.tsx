
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface VipPackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_months: number | null;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface VipPackageCardProps extends VipPackage {
}

const VipPackageCard: React.FC<VipPackageCardProps> = (pkg) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Convert VIP package to cart item format
    const cartItem = {
      id: pkg.id,
      title: `Begins.guide PRO - ${pkg.name}`,
      price: pkg.price,
      product_type: 'vip_package',
      image_url: null,
      slug: `pro-${pkg.id}`,
      description: pkg.description || ''
    };

    addToCart(cartItem);
    toast.success('เพิ่มแพ็กเกจ PRO ลงตะกร้าแล้ว');
  };

  if (!pkg.is_active) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="absolute top-4 right-4">
        <Crown className="w-6 h-6 text-yellow-600" />
      </div>
      
      <CardHeader>
        <div className="space-y-2">
          <Badge className="w-fit bg-yellow-600 text-white">
            {pkg.duration_months ? `${pkg.duration_months} เดือน` : 'ตลอดชีวิต'}
          </Badge>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Begins.guide PRO
          </CardTitle>
          <p className="text-lg font-semibold text-yellow-600">{pkg.name}</p>
          <p className="text-gray-600">{pkg.description}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-yellow-600">
            {pkg.price.toLocaleString()}
            <span className="text-lg text-gray-600 ml-1">บาท</span>
          </div>
          {pkg.duration_months && (
            <p className="text-sm text-gray-500 mt-1">
              ({(pkg.price / pkg.duration_months).toLocaleString()} บาท/เดือน)
            </p>
          )}
        </div>
        
        {pkg.features && pkg.features.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">ที่คุณจะได้รับ:</h4>
            <ul className="space-y-2">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3"
          size="lg"
        >
          เพิ่มลงตะกร้า
        </Button>
        
        <p className="text-xs text-center text-gray-500">
          * ชำระเงินครั้งเดียว เข้าถึงได้ทันที
        </p>
      </CardContent>
    </Card>
  );
};

export default VipPackageCard;
