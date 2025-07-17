import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useVipStatus } from '@/hooks/useVipStatus';
import { Button } from '@/components/ui/button';
import { ToolboxModal } from '@/components/ToolboxModal';
import { ProMemberNav } from '@/components/ProMemberNav';

export default function ToolboxPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();
  const { isVip } = useVipStatus();

  if (!hasBookAccess && !hasCourseAccess && !isVip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-center mt-4">
          คุณต้องซื้อหนังสือ คอร์ส หรือเป็นสมาชิก Pro เพื่อเข้าถึงเครื่องมือ
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProMemberNav />

      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Toolbox</h1>
        <p className="text-lg text-gray-600 mb-8">
          เครื่องมือช่วยสร้างและพัฒนาธุรกิจของคุณ
        </p>
        <Button
          size="lg"
          onClick={() => setIsModalOpen(true)}
        >
          เปิดกล่องเครื่องมือ
        </Button>
      </div>

      <ToolboxModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
