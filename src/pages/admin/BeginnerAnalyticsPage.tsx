import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import BeginnerAnalytics from '@/components/admin/BeginnerAnalytics';

const BeginnerAnalyticsPage = () => {
  return (
    <div className="py-8">
      <PageHeader 
        title="Beginner Analytics"
        description="วิเคราะห์ผู้ใช้ระดับ Beginner และอัตราการเปลี่ยนแปลงไปเป็นระดับอื่น"
      />
      
      <div className="space-y-8">
        <BeginnerAnalytics />
      </div>
    </div>
  );
};

export default BeginnerAnalyticsPage;
