
import { PageHeader } from "@/components/ui/page-header";
import VipPackageManager from "@/components/admin/VipPackageManager";

const VipPackagesPage = () => {
  return (
    <div className="py-8 space-y-8">
      <PageHeader
        title="จัดการแพ็กเกจ VIP"
        description="สร้าง แก้ไข และจัดการแพ็กเกจ VIP สำหรับลูกค้า"
      />
      <VipPackageManager />
    </div>
  );
};

export default VipPackagesPage;
