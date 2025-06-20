
import { PageHeader } from "@/components/ui/page-header";
import VipMembershipManager from "@/components/admin/VipMembershipManager";

const VipManagementPage = () => {
  return (
    <div className="py-8 space-y-8">
      <PageHeader
        title="จัดการสมาชิก VIP"
        description="เพิ่ม ลบ และจัดการสมาชิก VIP ที่สามารถเข้าถึงเนื้อหาทั้งหมดได้"
      />
      <VipMembershipManager />
    </div>
  );
};

export default VipManagementPage;
