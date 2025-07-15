import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PaymentSlipManager } from '@/components/admin/PaymentSlipManager';

const AdminPaymentSlipsPage: React.FC = () => {
  return (
    <AdminLayout>
      <PaymentSlipManager />
    </AdminLayout>
  );
};

export default AdminPaymentSlipsPage;