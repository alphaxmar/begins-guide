
import { PageHeader } from "@/components/ui/page-header";
import DiscountCodeManager from "@/components/admin/DiscountCodeManager";

const DiscountCodesPage = () => {
  return (
    <div className="py-8 space-y-8">
      <PageHeader
        title="จัดการโค้ดส่วนลด"
        description="สร้าง แก้ไข และจัดการโค้ดส่วนลดสำหรับลูกค้า"
      />
      <DiscountCodeManager />
    </div>
  );
};

export default DiscountCodesPage;
