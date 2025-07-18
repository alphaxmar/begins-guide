import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import ValueLadderAnalytics from '@/components/admin/ValueLadderAnalytics';

const ValueLadderDashboardPage = () => {
  return (
    <div className="py-8">
      <PageHeader 
        title="Value Ladder Analytics"
        description="วิเคราะห์การเดินทางของผู้ใช้ผ่าน 4 ระดับของ Value Ladder และ Conversion Rate"
      />
      
      <div className="space-y-8">
        <ValueLadderAnalytics />
      </div>
    </div>
  );
};

export default ValueLadderDashboardPage;
