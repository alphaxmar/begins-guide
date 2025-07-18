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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  Calculator,
  ArrowRight,
  UserPlus,
  Clock,
  Target,
  BookOpen,
  Zap,
  Crown
} from 'lucide-react';

// Mock data for Beginner analytics
const beginnerStats = {
  totalUsers: 2450,
  newThisMonth: 420,
  activeUsers: 1680,
  conversionRate: 36.3,
  avgSessionTime: '8.5 นาที',
  toolUsage: 85.2
};

const dailySignups = [
  { date: '1', signups: 25, calculatorUse: 18 },
  { date: '2', signups: 32, calculatorUse: 28 },
  { date: '3', signups: 28, calculatorUse: 24 },
  { date: '4', signups: 45, calculatorUse: 38 },
  { date: '5', signups: 38, calculatorUse: 32 },
  { date: '6', signups: 42, calculatorUse: 35 },
  { date: '7', signups: 35, calculatorUse: 29 }
];

const userJourney = [
  { step: 'Landing Page', users: 5000, conversion: 100 },
  { step: 'Sign Up', users: 2450, conversion: 49 },
  { step: 'Calculator Use', users: 2088, conversion: 85.2 },
  { step: 'Article Read', users: 1470, conversion: 60 },
  { step: 'Reader Upgrade', users: 890, conversion: 36.3 }
];

const topFeatures = [
  { feature: 'Dreamlining Calculator', usage: 85.2, users: 2088 },
  { feature: 'บทความพื้นฐาน', usage: 60.0, users: 1470 },
  { feature: 'Interactive Tool', usage: 45.5, users: 1115 },
  { feature: 'Community Board', usage: 32.8, users: 804 }
];

const conversionTargets = [
  { target: 'Reader', current: 890, potential: 1200, rate: 36.3 },
  { target: 'Pro Member', current: 156, potential: 350, rate: 6.4 },
  { target: 'Circle Member', current: 12, potential: 50, rate: 0.5 }
];

const BeginnerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const COLORS = ['#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Beginner ทั้งหมด</p>
                <p className="text-2xl font-bold">{beginnerStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <UserPlus className="w-3 h-3 mr-1" />
                  +{beginnerStats.newThisMonth} เดือนนี้
                </p>
              </div>
              <Calculator className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">กำลังใช้งาน</p>
                <p className="text-2xl font-bold">{beginnerStats.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {((beginnerStats.activeUsers / beginnerStats.totalUsers) * 100).toFixed(1)}% ของทั้งหมด
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{beginnerStats.conversionRate}%</p>
                <p className="text-xs text-green-600">
                  ไปเป็น Reader
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">เวลาใช้งานเฉลี่ย</p>
                <p className="text-2xl font-bold">{beginnerStats.avgSessionTime}</p>
                <p className="text-xs text-purple-600">
                  ต่อ Session
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity */}
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมรายวัน - Beginner</CardTitle>
          <CardDescription>การสมัครสมาชิกใหม่และการใช้ Calculator</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySignups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="signups" stroke="#8B5CF6" strokeWidth={2} name="สมัครใหม่" />
              <Line type="monotone" dataKey="calculatorUse" stroke="#10B981" strokeWidth={2} name="ใช้ Calculator" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Journey Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>User Journey - จาก Visitor สู่ Reader</CardTitle>
          <CardDescription>การไหลของผู้ใช้ในแต่ละขั้นตอน</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userJourney.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{step.step}</div>
                    <div className="text-sm text-gray-500">{step.users.toLocaleString()} คน</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{step.conversion}%</div>
                    <div className="text-sm text-gray-500">Conversion</div>
                  </div>
                  {index < userJourney.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>การใช้งานฟีเจอร์</CardTitle>
            <CardDescription>ฟีเจอร์ที่ได้รับความนิยมใน Beginner Level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{feature.feature}</span>
                      <span className="text-sm text-gray-500">{feature.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${feature.usage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{feature.users.toLocaleString()} คน</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>เป้าหมาย Conversion</CardTitle>
            <CardDescription>ศักยภาพในการอัปเกรดไปยังระดับอื่น</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionTargets.map((target, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {target.target === 'Reader' && <BookOpen className="h-4 w-4 text-green-600" />}
                      {target.target === 'Pro Member' && <Zap className="h-4 w-4 text-purple-600" />}
                      {target.target === 'Circle Member' && <Crown className="h-4 w-4 text-amber-600" />}
                      <span className="font-medium">{target.target}</span>
                    </div>
                    <Badge variant="outline">{target.rate}%</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ปัจจุบัน: {target.current} คน</span>
                      <span>เป้าหมาย: {target.potential} คน</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(target.current / target.potential) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อเสนอแนะเพื่อเพิ่ม Conversion</CardTitle>
          <CardDescription>กลยุทธ์ในการเปลี่ยน Beginner เป็น Paying Customer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">📚 เพิ่มคุณค่าใน Free Content</h4>
              <p className="text-sm text-green-700 mb-3">
                เพิ่มบทความคุณภาพสูงและ Case Studies เพื่อสร้างความน่าเชื่อถือ
              </p>
              <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                สร้างบทความใหม่
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">⚡ Freemium AI Tools</h4>
              <p className="text-sm text-blue-700 mb-3">
                ให้ทดลองใช้ AI Tools 3-5 ครั้งฟรี เพื่อให้เห็นคุณค่า
              </p>
              <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                ตั้งค่า Free Trial
              </Button>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">📧 Email Nurturing</h4>
              <p className="text-sm text-purple-700 mb-3">
                ส่งอีเมลสำหรับ Beginner ที่ไม่ได้ใช้งานเป็นเวลา 7 วัน
              </p>
              <Button size="sm" variant="outline" className="border-purple-300 text-purple-700">
                สร้าง Email Campaign
              </Button>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2">🎯 Targeted Offers</h4>
              <p className="text-sm text-amber-700 mb-3">
                เสนอส่วนลดหนังสือ Reader สำหรับคนที่ใช้ Calculator มากกว่า 3 ครั้ง
              </p>
              <Button size="sm" variant="outline" className="border-amber-300 text-amber-700">
                สร้าง Promotion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BeginnerAnalytics;
