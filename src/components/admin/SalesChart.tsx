
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDailySalesStats } from "@/hooks/useAdminStats";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const SalesChart = () => {
  const { data: salesData, isLoading } = useDailySalesStats(30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ยอดขายรายวัน (30 วันที่ผ่านมา)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  const chartData = salesData?.map(item => ({
    date: format(new Date(item.sale_date), 'dd/MM'),
    revenue: Number(item.daily_revenue),
    orders: Number(item.daily_orders)
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ยอดขายรายวัน (30 วันที่ผ่านมา)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'revenue' ? `฿${Number(value).toLocaleString()}` : value,
                name === 'revenue' ? 'รายได้' : 'จำนวนออเดอร์'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="รายได้"
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="จำนวนออเดอร์"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
