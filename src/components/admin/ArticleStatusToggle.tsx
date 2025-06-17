
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ArticleStatusToggleProps {
  articleSlug: string;
  currentStatus: "draft" | "published";
  disabled?: boolean;
}

const ArticleStatusToggle = ({ articleSlug, currentStatus, disabled }: ArticleStatusToggleProps) => {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: async (newStatus: "draft" | "published") => {
      const { error } = await supabase
        .from("articles")
        .update({ status: newStatus })
        .eq("slug", articleSlug);
      
      if (error) throw error;
    },
    onSuccess: (_, newStatus) => {
      toast.success(`เปลี่ยนสถานะเป็น "${newStatus === "published" ? "เผยแพร่" : "แบบร่าง"}" แล้ว`);
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการเปลี่ยนสถานะ: ${error.message}`);
    }
  });

  const handleToggle = (checked: boolean) => {
    const newStatus = checked ? "published" : "draft";
    statusMutation.mutate(newStatus);
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={currentStatus === "published"}
        onCheckedChange={handleToggle}
        disabled={disabled || statusMutation.isPending}
      />
      <Badge variant={currentStatus === "published" ? "default" : "outline"}>
        {currentStatus === "published" ? "เผยแพร่" : "แบบร่าง"}
      </Badge>
    </div>
  );
};

export default ArticleStatusToggle;
