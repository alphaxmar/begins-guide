import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, Target, TrendingUp, DollarSign, Clock, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

interface DreamlineData {
  monthlyExpenses: number;
  safetyMultiplier: number;
  timeToAchieve: number;
  currentSavings: number;
  desiredLifestyle: string;
}

const DreamlineCalculatorPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<DreamlineData>({
    monthlyExpenses: 0,
    safetyMultiplier: 6,
    timeToAchieve: 12,
    currentSavings: 0,
    desiredLifestyle: ''
  });

  const [results, setResults] = useState({
    freedomNumber: 0,
    monthlyIncomeNeeded: 0,
    gapToFill: 0,
    monthlyTarget: 0
  });

  const [usageCount, setUsageCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Load usage count from localStorage
    const savedCount = localStorage.getItem('dreamline-usage-count');
    if (savedCount) {
      setUsageCount(parseInt(savedCount));
    }
  }, []);

  const calculateResults = () => {
    // Check usage limit for non-users
    if (!user && usageCount >= 3) {
      toast.error('คุณใช้งานครบ 3 ครั้งแล้ว กรุณาสร้างบัญชีเพื่อใช้งานต่อ');
      return;
    }

    if (formData.monthlyExpenses <= 0) {
      toast.error('กรุณากรอกค่าใช้จ่ายรายเดือน');
      return;
    }

    // Calculate Freedom Number (Financial Independence)
    const freedomNumber = formData.monthlyExpenses * 12 * formData.safetyMultiplier;
    
    // Calculate monthly passive income needed
    const monthlyIncomeNeeded = freedomNumber * 0.04 / 12; // 4% rule
    
    // Calculate gap to fill
    const gapToFill = freedomNumber - formData.currentSavings;
    
    // Calculate monthly target to achieve goal
    const monthlyTarget = gapToFill / formData.timeToAchieve;

    setResults({
      freedomNumber,
      monthlyIncomeNeeded,
      gapToFill,
      monthlyTarget
    });

    setShowResults(true);

    // Update usage count for non-users
    if (!user) {
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem('dreamline-usage-count', newCount.toString());
    }

    toast.success('คำนวณเสร็จสิ้น!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const remainingUses = user ? '∞' : 3 - usageCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dreamlining Calculator
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">
            คำนวณ 'ตัวเลขแห่งอิสรภาพ' ของคุณและวางแผนเส้นทางสู่อิสรภาพทางการเงิน
          </p>
          
          {!user && (
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm">
              <Clock className="h-4 w-4" />
              <span>เหลือ {remainingUses} ครั้ง | สร้างบัญชีฟรีเพื่อใช้งานไม่จำกัด</span>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                ข้อมูลพื้นฐาน
              </CardTitle>
              <CardDescription>
                กรอกข้อมูลเพื่อคำนวณเป้าหมายทางการเงินของคุณ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="monthlyExpenses">ค่าใช้จ่ายรายเดือนปัจจุบัน (บาท)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  placeholder="30,000"
                  value={formData.monthlyExpenses || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    monthlyExpenses: Number(e.target.value)
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="safetyMultiplier">ตัวคูณความปลอดภัย (ปี)</Label>
                <Input
                  id="safetyMultiplier"
                  type="number"
                  placeholder="6"
                  value={formData.safetyMultiplier || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    safetyMultiplier: Number(e.target.value)
                  }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  แนะนำ 6-10 ปี สำหรับการมีเงินสำรองที่เพียงพอ
                </p>
              </div>

              <div>
                <Label htmlFor="timeToAchieve">เวลาที่ต้องการบรรลุเป้าหมาย (เดือน)</Label>
                <Input
                  id="timeToAchieve"
                  type="number"
                  placeholder="36"
                  value={formData.timeToAchieve || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    timeToAchieve: Number(e.target.value)
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="currentSavings">เงินออมปัจจุบัน (บาท)</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  placeholder="100,000"
                  value={formData.currentSavings || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    currentSavings: Number(e.target.value)
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="desiredLifestyle">ไลฟ์สไตล์ที่ต้องการ</Label>
                <Input
                  id="desiredLifestyle"
                  placeholder="เช่น: เที่ยวทั่วโลก, ทำงานที่บ้าน, เป็นผู้ประกอบการ"
                  value={formData.desiredLifestyle}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    desiredLifestyle: e.target.value
                  }))}
                />
              </div>

              <Button 
                onClick={calculateResults}
                className="w-full"
                disabled={!user && usageCount >= 3}
              >
                <Calculator className="mr-2 h-4 w-4" />
                คำนวณตัวเลขแห่งอิสรภาพ
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {showResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    ผลการคำนวณ
                  </CardTitle>
                  <CardDescription>
                    เป้าหมายทางการเงินของคุณ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">ตัวเลขแห่งอิสรภาพ</h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(results.freedomNumber)}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">รายได้เฉลี่ยต่อเดือนที่ต้องการ:</span>
                      <Badge variant="secondary">
                        {formatCurrency(results.monthlyIncomeNeeded)}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ช่องว่างที่ต้องเติม:</span>
                      <Badge variant="outline">
                        {formatCurrency(results.gapToFill)}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">เป้าหมายรายเดือน:</span>
                      <Badge variant="destructive">
                        {formatCurrency(results.monthlyTarget)}
                      </Badge>
                    </div>
                  </div>

                  {formData.desiredLifestyle && (
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-medium text-amber-800 mb-2">เป้าหมายไลฟ์สไตล์:</h4>
                      <p className="text-amber-700 text-sm">{formData.desiredLifestyle}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  เคล็ดลับ Freedom Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">💡 วิธีบรรลุเป้าหมาย:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• สร้างรายได้จากธุรกิจออนไลน์</li>
                    <li>• ลงทุนใน SaaS หรือ Digital Products</li>
                    <li>• สร้าง Passive Income Streams</li>
                    <li>• ลดค่าใช้จ่ายที่ไม่จำเป็น</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">🚀 เครื่องมือที่แนะนำ:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Idea Validator - ตรวจสอบไอเดียธุรกิจ</li>
                    <li>• SaaS Blueprint Generator - วางแผน SaaS</li>
                    <li>• Buyer Persona AI - เข้าใจลูกค้า</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="mt-12 text-center">
            <Card>
              <CardContent className="p-8">
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">พร้อมเริ่มต้นเส้นทางสู่อิสรภาพแล้วหรือยัง?</h3>
                <p className="text-gray-600 mb-6">
                  สร้างบัญชีฟรีเพื่อบันทึกผลการคำนวณและเข้าถึงเครื่องมือเพิ่มเติม
                </p>
                <div className="space-x-4">
                  <Button size="lg" onClick={() => window.location.href = '/auth'}>
                    สร้างบัญชีฟรี
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => window.location.href = '/pricing'}>
                    ดูแพ็คเกจทั้งหมด
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamlineCalculatorPage;
