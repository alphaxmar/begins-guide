import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import ReaderPackageManager from '@/components/admin/ReaderPackageManager';

const ReaderPackagesPage = () => {
  return (
    <div className="py-8">
      <PageHeader 
        title="จัดการแพ็กเกจ Reader"
        description="จัดการแพ็กเกจหนังสือและเนื้อหาสำหรับสมาชิก Reader Level"
      />
      
      <div className="space-y-8">
        <ReaderPackageManager />
      </div>
    </div>
  );
};

export default ReaderPackagesPage;
