
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ArticlePinToggleProps {
  articleSlug: string;
  isPinned: boolean;
}

const ArticlePinToggle = ({ articleSlug, isPinned }: ArticlePinToggleProps) => {
  const queryClient = useQueryClient();

  const togglePinMutation = useMutation({
    mutationFn: async (newPinnedStatus: boolean) => {
      const { error } = await supabase
        .from("articles")
        .update({ is_pinned_on_hub: newPinnedStatus })
        .eq("slug", articleSlug);
      
      if (error) throw error;
      return newPinnedStatus;
    },
    onSuccess: (newStatus) => {
      toast.success(
        newStatus 
          ? "ปักหมุดบทความในหน้าคลังความรู้แล้ว" 
          : "ยกเลิกการปักหมุดบทความแล้ว"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["pinned-articles"] });
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  });

  const handleToggle = (checked: boolean) => {
    togglePinMutation.mutate(checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`pin-${articleSlug}`}
        checked={isPinned}
        onCheckedChange={handleToggle}
        disabled={togglePinMutation.isPending}
      />
      <Label htmlFor={`pin-${articleSlug}`} className="text-xs">
        ปักหมุด
      </Label>
    </div>
  );
};

export default ArticlePinToggle;
