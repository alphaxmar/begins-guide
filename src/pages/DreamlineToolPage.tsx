import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDreamlines, Dreamline } from '@/hooks/useDreamlines';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, Calculator, Target, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PDFDownloadButton } from '@/components/PDFDownloadButton';

interface DreamlineRowProps {
  dreamline: Dreamline;
  onUpdate: (id: string, updates: Partial<Dreamline>) => void;
  onDelete: (id: string) => void;
}

const DreamlineRow: React.FC<DreamlineRowProps> = ({ dreamline, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(dreamline.title);
  const [cost, setCost] = useState(dreamline.cost.toString());
  const [timePeriod, setTimePeriod] = useState(dreamline.time_period || '1_year');
  const [hasChanges, setHasChanges] = useState(false);

  // Use local state และ debounce การอัปเดต
  useEffect(() => {
    setTitle(dreamline.title);
    setCost(dreamline.cost.toString());
    setTimePeriod(dreamline.time_period || '1_year');
    setHasChanges(false);
  }, [dreamline.title, dreamline.cost, dreamline.time_period]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleCostChange = (value: string) => {
    setCost(value);
    setHasChanges(true);
  };

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value as any);
    setHasChanges(true);
  };

  const handleBlur = () => {
    // อัปเดต database เฉพาะเมื่อมีการเปลี่ยนแปลงจริงๆ
    if (dreamline.id && hasChanges) {
      const numValue = parseFloat(cost) || 0;
      onUpdate(dreamline.id, { 
        title: title.trim(),
        cost: numValue,
        time_period: timePeriod as any
      });
      setHasChanges(false);
    }
  };

  const getTimePeriodLabel = (period: string) => {
    const labels = {
      '1_year': '🎯 1 ปี',
      '3_years': '📈 3 ปี', 
      '5_years': '🌟 5 ปี',
      '10_years': '🚀 10 ปี',
      'lifetime': '♾️ ตลอดชีวิต'
    };
    return labels[period as keyof typeof labels] || '🎯 1 ปี';
  };

  return (
    <div className="space-y-2 mb-4 p-3 border rounded-lg bg-card">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="เช่น บ้านหลังใหม่, เรียนต่อปริญญาโท, เที่ยวญี่ปุ่น"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onBlur={handleBlur}
          className={`flex-1 ${hasChanges ? 'border-orange-300 bg-orange-50' : ''}`}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dreamline.id && onDelete(dreamline.id)}
          className="text-destructive hover:text-destructive shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="0"
            value={cost}
            onChange={(e) => handleCostChange(e.target.value)}
            onBlur={handleBlur}
            className={`${hasChanges ? 'border-orange-300 bg-orange-50' : ''}`}
            min="0"
            step="0.01"
          />
        </div>
        <div className="flex-1">
          <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
            <SelectTrigger className={hasChanges ? 'border-orange-300 bg-orange-50' : ''}>
              <Clock className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1_year">🎯 ภายใน 1 ปี</SelectItem>
              <SelectItem value="3_years">📈 ภายใน 3 ปี</SelectItem>
              <SelectItem value="5_years">🌟 ภายใน 5 ปี</SelectItem>
              <SelectItem value="10_years">🚀 ภายใน 10 ปี</SelectItem>
              <SelectItem value="lifetime">♾️ ตลอดชีวิต</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {timePeriod && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          เป้าหมาย: {getTimePeriodLabel(timePeriod)}
        </div>
      )}
    </div>
  );
};

interface DreamlineColumnProps {
  title: string;
  description: string;
  category: 'having' | 'being' | 'doing';
  dreamlines: Dreamline[];
  total: number;
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Dreamline>) => void;
  onDelete: (id: string) => void;
}

const DreamlineColumn: React.FC<DreamlineColumnProps> = ({
  title,
  description,
  category,
  dreamlines,
  total,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const categoryDreamlines = dreamlines.filter(d => d.category === category);
  
  // Group dreamlines by time period for better organization
  const groupedByTimePeriod = categoryDreamlines.reduce((acc, dreamline) => {
    const period = dreamline.time_period || '1_year';
    if (!acc[period]) acc[period] = [];
    acc[period].push(dreamline);
    return acc;
  }, {} as Record<string, Dreamline[]>);

  const timePeriodOrder = ['1_year', '3_years', '5_years', '10_years', 'lifetime'];
  const timePeriodLabels = {
    '1_year': '🎯 1 ปี',
    '3_years': '📈 3 ปี', 
    '5_years': '🌟 5 ปี',
    '10_years': '🚀 10 ปี',
    'lifetime': '♾️ ตลอดชีวิต'
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          {category === 'having' && '💎'}
          {category === 'being' && '🌟'}
          {category === 'doing' && '🎯'}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {timePeriodOrder.map(period => {
            const periodDreamlines = groupedByTimePeriod[period] || [];
            if (periodDreamlines.length === 0) return null;
            
            return (
              <div key={period} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  เป้าหมาย {timePeriodLabels[period as keyof typeof timePeriodLabels]}
                </div>
                {periodDreamlines.map((dreamline) => (
                  <DreamlineRow
                    key={dreamline.id}
                    dreamline={dreamline}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            );
          })}
          
          {categoryDreamlines.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">
                {category === 'having' && '💎'}
                {category === 'being' && '🌟'}
                {category === 'doing' && '🎯'}
              </div>
              <p className="text-sm">ยังไม่มีความฝันในหมวดนี้</p>
              <p className="text-xs">เริ่มต้นเพิ่มรายการแรกของคุณ</p>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="w-full border-dashed hover:border-primary hover:text-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มรายการใหม่
        </Button>

        <Separator />
        
        <div className="text-right">
          <p className="text-sm text-muted-foreground">รวมต่อปี</p>
          <p className="text-2xl font-bold text-primary">
            ฿{total.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const DreamlineToolPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    dreamlines,
    summary,
    loading,
    addDreamline,
    updateDreamline,
    deleteDreamline,
    updateMonthlyExpenses,
    saveAllData,
  } = useDreamlines();

  const [monthlyExpenses, setMonthlyExpenses] = useState('0');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/dreamline');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (summary) {
      setMonthlyExpenses(summary.monthly_basic_expenses.toString());
    }
  }, [summary]);

  const handleAddDreamline = (category: 'having' | 'being' | 'doing') => {
    addDreamline({
      title: '',
      category,
      cost: 0,
      time_period: '1_year',
    });
    setHasUnsavedChanges(true);
    setLastSavedTime(null); // Reset last saved time when changes are made
  };

  const handleUpdateDreamline = (id: string, updates: Partial<Dreamline>) => {
    updateDreamline(id, updates);
    setHasUnsavedChanges(true);
    setLastSavedTime(null); // Reset last saved time when changes are made
  };

  const handleDeleteDreamline = (id: string) => {
    deleteDreamline(id);
    setHasUnsavedChanges(true);
    setLastSavedTime(null); // Reset last saved time when changes are made
  };

  const handleSaveAllData = async () => {
    setIsCalculating(true);
    try {
      await saveAllData();
      setHasUnsavedChanges(false);
      setLastSavedTime(new Date());
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRecalculateTMI = async () => {
    setIsCalculating(true);
    try {
      await saveAllData(); // ใช้ function เดียวกัน เพราะมันจะ calculate TMI อยู่แล้ว
      setLastSavedTime(new Date());
    } finally {
      setIsCalculating(false);
    }
  };

  const handleUpdateExpenses = () => {
    const value = parseFloat(monthlyExpenses) || 0;
    updateMonthlyExpenses(value);
    setHasUnsavedChanges(true);
    setLastSavedTime(null); // Reset last saved time when changes are made
  };

  const totalHaving = dreamlines
    .filter(d => d.category === 'having')
    .reduce((sum, d) => sum + d.cost, 0);

  const totalBeing = dreamlines
    .filter(d => d.category === 'being')
    .reduce((sum, d) => sum + d.cost, 0);

  const totalDoing = dreamlines
    .filter(d => d.category === 'doing')
    .reduce((sum, d) => sum + d.cost, 0);

  const grandTotal = totalHaving + totalBeing + totalDoing;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Target className="w-4 h-4 mr-2" />
            Interactive Dreamlining Tool
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            วางแผนชีวิตในฝันของคุณ
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            กรอกสิ่งที่คุณอยากมี อยากเป็น และอยากทำ พร้อมราคาที่ต้องใช้ 
            เครื่องมือจะคำนวณรายได้เป้าหมายต่อเดือนให้คุณโดยอัตโนมัติ
          </p>
        </div>

        {/* TMI Display */}
        {summary && summary.target_monthly_income > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Target Monthly Income (TMI) ของคุณคือ
                </p>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  ฿{summary.target_monthly_income.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  ต่อเดือน เพื่อให้ชีวิตในฝันกลายเป็นจริงได้
                </p>
                {lastSavedTime && (
                  <p className="text-xs text-muted-foreground">
                    อัปเดตล่าสุด: {lastSavedTime.toLocaleString('th-TH')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <DreamlineColumn
            title="สิ่งที่อยากมี (Having)"
            description="สิ่งของ ทรัพย์สิน เงิน ที่คุณอยากได้"
            category="having"
            dreamlines={dreamlines}
            total={totalHaving}
            onAdd={() => handleAddDreamline('having')}
            onUpdate={handleUpdateDreamline}
            onDelete={handleDeleteDreamline}
          />

          <DreamlineColumn
            title="สิ่งที่อยากเป็น (Being)"
            description="สถานะ บทบาท ตำแหน่ง ที่คุณอยากเป็น"
            category="being"
            dreamlines={dreamlines}
            total={totalBeing}
            onAdd={() => handleAddDreamline('being')}
            onUpdate={handleUpdateDreamline}
            onDelete={handleDeleteDreamline}
          />

          <DreamlineColumn
            title="สิ่งที่อยากทำ (Doing)"
            description="กิจกรรม ประสบการณ์ ที่คุณอยากทำ"
            category="doing"
            dreamlines={dreamlines}
            total={totalDoing}
            onAdd={() => handleAddDreamline('doing')}
            onUpdate={handleUpdateDreamline}
            onDelete={handleDeleteDreamline}
          />
        </div>

        {/* Time Period Summary */}
        {dreamlines.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                สรุปตามระยะเวลา
              </CardTitle>
              <CardDescription>
                แบ่งความฝันตามช่วงเวลาที่ต้องการให้เป็นจริง
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { key: '1_year', label: '🎯 1 ปี', color: 'text-red-600 bg-red-50 border-red-200' },
                  { key: '3_years', label: '📈 3 ปี', color: 'text-orange-600 bg-orange-50 border-orange-200' },
                  { key: '5_years', label: '🌟 5 ปี', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
                  { key: '10_years', label: '🚀 10 ปี', color: 'text-blue-600 bg-blue-50 border-blue-200' },
                  { key: 'lifetime', label: '♾️ ตลอดชีวิต', color: 'text-purple-600 bg-purple-50 border-purple-200' }
                ].map(({ key, label, color }) => {
                  const periodDreamlines = dreamlines.filter(d => (d.time_period || '1_year') === key);
                  const totalCost = periodDreamlines.reduce((sum, d) => sum + d.cost, 0);
                  
                  return (
                    <div key={key} className={`p-4 rounded-lg border ${color}`}>
                      <div className="text-center">
                        <p className="text-sm font-medium mb-1">{label}</p>
                        <p className="text-xl font-bold">฿{totalCost.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {periodDreamlines.length} รายการ
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary and Basic Expenses */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>สรุปรวม</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Having (สิ่งที่อยากมี):</span>
                <span className="font-semibold">฿{totalHaving.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Being (สิ่งที่อยากเป็น):</span>
                <span className="font-semibold">฿{totalBeing.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Doing (สิ่งที่อยากทำ):</span>
                <span className="font-semibold">฿{totalDoing.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>ค่าใช้จ่ายความฝันรวม (ต่อปี):</span>
                <span className="text-primary">฿{grandTotal.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ค่าใช้จ่ายพื้นฐานรายเดือน</CardTitle>
              <CardDescription>
                ค่าใช้จ่ายประจำเดือนปัจจุบันของคุณ (ค่าอาหาร ที่พัก ค่าใช้จ่ายจำเป็น)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="30000"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <Button onClick={handleUpdateExpenses}>
                  <Calculator className="w-4 h-4 mr-2" />
                  คำนวณ
                </Button>
              </div>
              {summary && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    รายได้เป้าหมายต่อเดือน (TMI)
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    ฿{summary.target_monthly_income.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    = (฿{grandTotal.toLocaleString()} ÷ 12) + ฿{summary.monthly_basic_expenses.toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center mb-4">
          {hasUnsavedChanges && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-300 rounded-lg text-orange-800 mb-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</span>
            </div>
          )}

          {!hasUnsavedChanges && lastSavedTime && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-lg text-green-800 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                บันทึกข้อมูลแล้ว - {lastSavedTime.toLocaleTimeString('th-TH')}
              </span>
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {hasUnsavedChanges 
                ? '⚠️ กดปุ่ม "บันทึกการเปลี่ยนแปลง" เพื่อบันทึกข้อมูลและคำนวณ TMI ใหม่'
                : '💡 กดปุ่ม "คำนวณ TMI ใหม่" เพื่ออัปเดตการคำนวณตามข้อมูลปัจจุบัน'
              }
            </p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 flex-wrap">
          {hasUnsavedChanges ? (
            <Button
              onClick={handleSaveAllData}
              disabled={loading || isCalculating}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              {(loading || isCalculating) ? 'กำลังบันทึกและคำนวณ...' : 'บันทึกการเปลี่ยนแปลง'}
            </Button>
          ) : (
            <Button
              onClick={handleRecalculateTMI}
              disabled={loading || isCalculating}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white transition-colors duration-300"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {(loading || isCalculating) ? 'กำลังคำนวณ...' : 'คำนวณ TMI ใหม่'}
            </Button>
          )}
          
          <PDFDownloadButton
            dreamlines={dreamlines}
            summary={summary}
            variant="outline"
            size="lg"
          />
          
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium"
          >
            ไปยังแดชบอร์ด
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DreamlineToolPage;