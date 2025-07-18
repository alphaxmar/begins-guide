import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDreamlines, Dreamline } from '@/hooks/useDreamlines';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, Calculator, Target } from 'lucide-react';
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
  const [hasChanges, setHasChanges] = useState(false);

  // Use local state และ debounce การอัปเดต
  useEffect(() => {
    setTitle(dreamline.title);
    setCost(dreamline.cost.toString());
    setHasChanges(false);
  }, [dreamline.title, dreamline.cost]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleCostChange = (value: string) => {
    setCost(value);
    setHasChanges(true);
  };

  const handleBlur = () => {
    // อัปเดต database เฉพาะเมื่อมีการเปลี่ยนแปลงจริงๆ
    if (dreamline.id && hasChanges) {
      const numValue = parseFloat(cost) || 0;
      onUpdate(dreamline.id, { 
        title: title.trim(),
        cost: numValue 
      });
      setHasChanges(false);
    }
  };

  return (
    <div className="flex gap-2 items-center mb-2">
      <Input
        placeholder="เช่น บ้านหลังใหม่, เรียนต่อปริญญาโท, เที่ยวญี่ปุ่น"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        onBlur={handleBlur}
        className={`flex-1 ${hasChanges ? 'border-orange-300 bg-orange-50' : ''}`}
      />
      <Input
        type="number"
        placeholder="0"
        value={cost}
        onChange={(e) => handleCostChange(e.target.value)}
        onBlur={handleBlur}
        className={`w-32 ${hasChanges ? 'border-orange-300 bg-orange-50' : ''}`}
        min="0"
        step="0.01"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => dreamline.id && onDelete(dreamline.id)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {categoryDreamlines.map((dreamline) => (
            <DreamlineRow
              key={dreamline.id}
              dreamline={dreamline}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มรายการ
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
    });
    setHasUnsavedChanges(true);
  };

  const handleUpdateDreamline = (id: string, updates: Partial<Dreamline>) => {
    updateDreamline(id, updates);
    setHasUnsavedChanges(true);
  };

  const handleDeleteDreamline = (id: string) => {
    deleteDreamline(id);
    setHasUnsavedChanges(true);
  };

  const handleSaveAllData = async () => {
    await saveAllData();
    setHasUnsavedChanges(false);
  };

  const handleUpdateExpenses = () => {
    const value = parseFloat(monthlyExpenses) || 0;
    updateMonthlyExpenses(value);
    setHasUnsavedChanges(true);
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
                <p className="text-sm text-muted-foreground">
                  ต่อเดือน เพื่อให้ชีวิตในฝันกลายเป็นจริงได้
                </p>
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
        {hasUnsavedChanges && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-300 rounded-lg text-orange-800">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</span>
            </div>
          </div>
        )}
        
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            💡 หลังจากกรอกข้อมูลเสร็จแล้ว กดปุ่ม "บันทึกข้อมูลและคำนวณ TMI" เพื่ออัปเดตรายได้เป้าหมายของคุณ
          </p>
        </div>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            onClick={handleSaveAllData}
            disabled={loading}
            size="lg"
            className={`${hasUnsavedChanges ? 'bg-orange-600 hover:bg-orange-700' : 'bg-primary hover:bg-primary/90'} text-white`}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'กำลังบันทึกและคำนวณ...' : 'บันทึกข้อมูลและคำนวณ TMI'}
          </Button>
          
          <PDFDownloadButton
            dreamlines={dreamlines}
            summary={summary}
            variant="outline"
            size="lg"
          />
          
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            size="lg"
          >
            ไปยังแดชบอร์ด
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DreamlineToolPage;