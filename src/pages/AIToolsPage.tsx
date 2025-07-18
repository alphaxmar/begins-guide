import { useAuth } from '@/contexts/AuthContext';
import { useVipStatus } from '@/hooks/useVipStatus';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ExternalLink, Brain, FileText, TrendingUp, Sparkles, MessageSquare, Tag, Target } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { ToolboxModal } from '@/components/ToolboxModal';
import { useState } from 'react';

const AIToolsPage = () => {
  const { user } = useAuth();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();
  const { isVip } = useVipStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect non-authenticated users to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Block users without any access
  if (!hasBookAccess && !hasCourseAccess && !isVip) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              เครื่องมือ AI Power Tools
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              คุณต้องซื้อหนังสือ คอร์ส หรือเป็นสมาชิก Pro เพื่อเข้าถึงเครื่องมือ
            </p>
            <Card className="border-yellow-200 bg-yellow-50 max-w-md mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  เลือกแพ็คเกจที่เหมาะกับคุณ:
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-yellow-800">
                  <li className="flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    หนังสือ - เข้าถึง AI Tool 1 เครื่องมือ
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    คอร์ส - เข้าถึง AI Tools 4 เครื่องมือ
                  </li>
                  <li className="flex items-center">
                    <Crown className="h-4 w-4 mr-2" />
                    Pro Member - เข้าถึงทุกเครื่องมือ
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              AI Power Tools
            </h1>
            <p className="text-xl text-gray-600">
              เครื่องมือ AI ที่จะช่วยให้คุณสร้างและพัฒนาธุรกิจได้อย่างมีประสิทธิภาพ
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>เครื่องมือที่คุณสามารถเข้าถึงได้</CardTitle>
              <CardDescription>
                {isVip && "คุณเป็น Pro Member สามารถเข้าถึงเครื่องมือทั้งหมดได้"}
                {!isVip && hasCourseAccess && "คุณซื้อคอร์ส สามารถเข้าถึงเครื่องมือได้ 4 เครื่องมือ"}
                {!isVip && !hasCourseAccess && hasBookAccess && "คุณซื้อหนังสือ สามารถเข้าถึงเครื่องมือได้ 1 เครื่องมือ"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="w-full"
              >
                เปิดใช้งานเครื่องมือ AI
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ฟีเจอร์ที่มีให้ใช้งาน</CardTitle>
                <CardDescription>รายละเอียดเครื่องมือที่คุณสามารถใช้งานได้</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Brain className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <h4 className="font-medium">สร้างไอเดียธุรกิจ</h4>
                      <p className="text-sm text-gray-600">ใช้ AI ช่วยระดมความคิดและสร้างไอเดียธุรกิจใหม่ๆ</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <h4 className="font-medium">วิเคราะห์กลุ่มเป้าหมาย</h4>
                      <p className="text-sm text-gray-600">สร้าง Buyer Persona และวิเคราะห์พฤติกรรมลูกค้า</p>
                    </div>
                  </li>
                  {(hasCourseAccess || isVip) && (
                    <>
                      <li className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                        <div>
                          <h4 className="font-medium">ตรวจสอบไอเดีย</h4>
                          <p className="text-sm text-gray-600">วิเคราะห์ความเป็นไปได้และโอกาสทางธุรกิจ</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <TrendingUp className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                        <div>
                          <h4 className="font-medium">วิเคราะห์เมตริก</h4>
                          <p className="text-sm text-gray-600">ติดตามและวิเคราะห์ตัวชี้วัดสำคัญของธุรกิจ</p>
                        </div>
                      </li>
                    </>
                  )}
                  {isVip && (
                    <li className="flex items-start">
                      <Sparkles className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                      <div>
                        <h4 className="font-medium">สร้าง Blueprint</h4>
                        <p className="text-sm text-gray-600">วางแผนและออกแบบธุรกิจ SaaS แบบครบวงจร</p>
                      </div>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ToolboxModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AIToolsPage;
