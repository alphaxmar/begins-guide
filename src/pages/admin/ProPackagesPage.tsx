
import { PageHeader } from "@/components/ui/page-header";
import ProPackageManager from "@/components/admin/ProPackageManager";

const ProPackagesPage = () => {
  return (
    <div className="py-8 space-y-8">
      <PageHeader
        title="จัดการแพ็กเกจ PRO"
        description="สร้าง แก้ไข และจัดการแพ็กเกจ Begins.guide PRO สำหรับลูกค้า"
      />
      <ProPackageManager />
    </div>
  );
};

export default ProPackagesPage;
