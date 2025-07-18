import React from 'react';
import CircleMembershipManager from '@/components/admin/CircleMembershipManager';

const CircleMembershipsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">จัดการสมาชิก Circle Level</h1>
        <p className="text-muted-foreground">
          จัดการสมาชิกระดับสูงสุดในระบบ Value Ladder
        </p>
      </div>
      
      <CircleMembershipManager />
    </div>
  );
};

export default CircleMembershipsPage;
