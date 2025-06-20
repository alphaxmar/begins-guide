
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CreditCard, Smartphone, DollarSign } from "lucide-react";

interface PaymentStatsCardProps {
  title: string;
  amount: number;
  transactions: number;
  percentage: number;
  icon: 'stripe' | 'omise' | 'promptpay';
  trend: 'up' | 'down' | 'stable';
}

const PaymentStatsCard = ({ 
  title, 
  amount, 
  transactions, 
  percentage, 
  icon, 
  trend 
}: PaymentStatsCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'stripe':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'omise':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      case 'promptpay':
        return <Smartphone className="h-4 w-4 text-green-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">฿{amount.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          {transactions} รายการ
        </p>
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant="outline" className={getTrendColor()}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {percentage}%
          </Badge>
          <span className="text-xs text-muted-foreground">เทียบเดือนที่แล้ว</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStatsCard;
