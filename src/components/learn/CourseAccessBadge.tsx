
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, ShoppingCart } from "lucide-react";

interface CourseAccessBadgeProps {
  accessType: 'admin' | 'vip' | 'purchased' | 'none';
}

const CourseAccessBadge = ({ accessType }: CourseAccessBadgeProps) => {
  if (accessType === 'none') return null;

  const configs = {
    admin: {
      icon: Shield,
      label: 'ผู้ดูแลระบบ',
      variant: 'destructive' as const,
      className: 'bg-red-500 text-white'
    },
    vip: {
      icon: Crown,
      label: 'สมาชิก VIP',
      variant: 'default' as const,
      className: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    },
    purchased: {
      icon: ShoppingCart,
      label: 'ซื้อแล้ว',
      variant: 'outline' as const,
      className: 'bg-green-100 text-green-800 border-green-300'
    }
  };

  const config = configs[accessType];
  const IconComponent = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <IconComponent className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default CourseAccessBadge;
