
import { PageHeader } from "@/components/ui/page-header";
import ProMembershipManager from "@/components/admin/ProMembershipManager";

const ProMembershipsPage = () => {
  return (
    <div className="py-8 space-y-8">
      <PageHeader
        title="จัดการสมาชิก PRO"
        description="จัดการสมาชิก Begins.guide PRO และ Subscription Status"
      />
      <ProMembershipManager />
    </div>
  );
};

export default ProMembershipsPage;
