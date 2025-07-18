import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Calculator,
  BookOpen,
  Zap,
  Crown,
  ArrowUp,
  ArrowDown,
  Percent
} from 'lucide-react';

// Mock data - replace with real API calls
const valueLadderData = [
  { level: 'Beginner', users: 2450, revenue: 0, color: '#6B7280' },
  { level: 'Reader', users: 890, revenue: 400500, color: '#10B981' },
  { level: 'Pro Member', users: 340, revenue: 1016600, color: '#8B5CF6' },
  { level: 'Circle Member', users: 45, revenue: 449550, color: '#F59E0B' }
];

const conversionData = [
  { from: 'Beginner', to: 'Reader', rate: 36.3, count: 890 },
  { from: 'Reader', to: 'Pro Member', rate: 38.2, count: 340 },
  { from: 'Pro Member', to: 'Circle Member', rate: 13.2, count: 45 }
];

const monthlyTrends = [
  { month: 'ม.ค.', beginner: 1800, reader: 520, pro: 180, circle: 25 },
  { month: 'ก.พ.', beginner: 2100, reader: 680, pro: 240, circle: 32 },
  { month: 'มี.ค.', beginner: 2450, reader: 890, pro: 340, circle: 45 },
];

const revenueByLevel = [
  { month: 'ม.ค.', reader: 234000, pro: 532800, circle: 249750 },
  { month: 'ก.พ.', reader: 306000, pro: 709200, circle: 319200 },
  { month: 'มี.ค.', reader: 400500, pro: 1016600, circle: 449550 },
];

const ValueLadderAnalytics = () => {
  const [timeRange, setTimeRange] = useState('3months');

  const totalUsers = valueLadderData.reduce((sum, level) => sum + level.users, 0);
  const totalRevenue = valueLadderData.reduce((sum, level) => sum + level.revenue, 0);
  const avgRevenuePerUser = totalRevenue / totalUsers;

  const COLORS = ['#6B7280', '#10B981', '#8B5CF6', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +12.5% จากเดือนที่แล้ว
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">รายได้รวม</p>
                <p className="text-2xl font-bold">฿{(totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +28.7% จากเดือนที่แล้ว
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ARPU เฉลี่ย</p>
                <p className="text-2xl font-bold">฿{Math.round(avgRevenuePerUser).toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +14.2% จากเดือนที่แล้ว
                </p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">29.2%</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <ArrowDown className="w-3 h-3 mr-1" />
                  -2.1% จากเดือนที่แล้ว
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Value Ladder Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>การกระจายตัวใน Value Ladder</CardTitle>
            <CardDescription>จำนวนผู้ใช้ในแต่ละระดับ</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={valueLadderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip formatter={(value) => [value.toLocaleString(), 'ผู้ใช้']} />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>สัดส่วนรายได้ตามระดับ</CardTitle>
            <CardDescription>การมีส่วนร่วมของรายได้แต่ละระดับ</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={valueLadderData.filter(d => d.revenue > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, revenue }) => `${level}: ฿${(revenue/1000000).toFixed(1)}M`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {valueLadderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`฿${(value/1000000).toFixed(2)}M`, 'รายได้']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>อัตราการเปลี่ยนแปลงระหว่างระดับ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionData.map((conversion, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium">{conversion.from}</div>
                  <div className="text-gray-400">→</div>
                  <div className="text-sm font-medium">{conversion.to}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-green-600">
                    {conversion.rate}%
                  </div>
                  <Badge variant="secondary">
                    {conversion.count} คน
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>แนวโน้มรายเดือน</CardTitle>
          <CardDescription>การเติบโตของผู้ใช้ในแต่ละระดับ</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="beginner" stroke="#6B7280" strokeWidth={2} name="Beginner" />
              <Line type="monotone" dataKey="reader" stroke="#10B981" strokeWidth={2} name="Reader" />
              <Line type="monotone" dataKey="pro" stroke="#8B5CF6" strokeWidth={2} name="Pro Member" />
              <Line type="monotone" dataKey="circle" stroke="#F59E0B" strokeWidth={2} name="Circle Member" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>แนวโน้มรายได้</CardTitle>
          <CardDescription>รายได้รายเดือนแยกตามระดับ</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueByLevel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `฿${(value/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => [`฿${value.toLocaleString()}`, 'รายได้']} />
              <Area type="monotone" dataKey="reader" stackId="1" stroke="#10B981" fill="#10B981" />
              <Area type="monotone" dataKey="pro" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
              <Area type="monotone" dataKey="circle" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Level Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-gray-600" />
              Beginner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-700">
                {valueLadderData[0].users.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">ผู้ใช้ฟรี</div>
              <Badge variant="outline" className="text-xs">
                ราคา: ฟรี
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-green-600" />
              Reader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-700">
                {valueLadderData[1].users.toLocaleString()}
              </div>
              <div className="text-sm text-green-500">
                ฿{(valueLadderData[1].revenue / 1000).toFixed(0)}K รายได้
              </div>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                ราคา: ฿450
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-purple-600" />
              Pro Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-700">
                {valueLadderData[2].users.toLocaleString()}
              </div>
              <div className="text-sm text-purple-500">
                ฿{(valueLadderData[2].revenue / 1000000).toFixed(1)}M รายได้
              </div>
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                ราคา: ฿2,990/ปี
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="h-5 w-5 text-amber-600" />
              Circle Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-amber-700">
                {valueLadderData[3].users.toLocaleString()}
              </div>
              <div className="text-sm text-amber-500">
                ฿{(valueLadderData[3].revenue / 1000).toFixed(0)}K รายได้
              </div>
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                ราคา: ฿9,990/ปี
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อเสนอแนะเพื่อปรับปรุง</CardTitle>
          <CardDescription>วิเคราะห์และแนวทางในการเพิ่ม Conversion Rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">เพิ่ม Beginner → Reader Conversion</h4>
                <p className="text-sm text-blue-700">
                  ปัจจุบัน 36.3% ควรเป้าหมาย 45%+ ด้วยการเพิ่ม Free Trial ของ AI Tools
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <Target className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">พัฒนา Pro Member Retention</h4>
                <p className="text-sm text-green-700">
                  มี Pro Member 340 คน ควรเพิ่มการมีส่วนร่วมด้วย Workshop และ Community
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg">
              <Crown className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">ขยาย Circle Member Benefits</h4>
                <p className="text-sm text-amber-700">
                  Circle Member มีรายได้ต่อคนสูงสุด ควรเพิ่มสิทธิพิเศษและ 1:1 Consultation
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueLadderAnalytics;
