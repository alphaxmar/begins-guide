import React from 'react';
import CirclePackageManager from '@/components/admin/CirclePackageManager';

const CirclePackagesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">จัดการแพ็กเกจ Circle Level</h1>
        <p className="text-muted-foreground">
          จัดการแพ็กเกจพิเศษสำหรับสมาชิก Circle Level
        </p>
      </div>
      
      <CirclePackageManager />
    </div>
  );
};

export default CirclePackagesPage;
