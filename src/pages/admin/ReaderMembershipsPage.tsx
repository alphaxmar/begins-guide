import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import ReaderMembershipManager from '@/components/admin/ReaderMembershipManager';

const ReaderMembershipsPage = () => {
  return (
    <div className="py-8">
      <PageHeader 
        title="จัดการสมาชิก Reader"
        description="จัดการผู้ซื้อหนังสือและสิทธิ์ Reader Level ในระบบ Value Ladder"
      />
      
      <div className="space-y-8">
        <ReaderMembershipManager />
      </div>
    </div>
  );
};

export default ReaderMembershipsPage;
