
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

const fetchLessonAttachments = async (lessonId: string): Promise<Tables<'lesson_attachments'>[]> => {
  const { data, error } = await supabase
    .from("lesson_attachments")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const useLessonAttachments = (lessonId: string) => {
  const queryClient = useQueryClient();

  const { data: attachments, isLoading } = useQuery({
    queryKey: ["lesson-attachments", lessonId],
    queryFn: () => fetchLessonAttachments(lessonId),
    enabled: !!lessonId,
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: async (attachmentId: string) => {
      // First get the attachment to know the file path
      const { data: attachment } = await supabase
        .from("lesson_attachments")
        .select("file_path")
        .eq("id", attachmentId)
        .single();

      if (attachment) {
        // Delete from storage
        await supabase.storage
          .from('lesson_attachments')
          .remove([attachment.file_path]);
      }

      // Delete from database
      const { error } = await supabase
        .from("lesson_attachments")
        .delete()
        .eq("id", attachmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("ลบไฟล์แนบเรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ["lesson-attachments", lessonId] });
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const generateDownloadUrlMutation = useMutation({
    mutationFn: async (filePath: string) => {
      const { data, error } = await supabase.storage
        .from('lesson_attachments')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    },
    onError: (error) => {
      toast.error(`ไม่สามารถสร้างลิงก์ดาวน์โหลดได้: ${error.message}`);
    },
  });

  return {
    attachments,
    isLoading,
    deleteAttachment: deleteAttachmentMutation.mutate,
    generateDownloadUrl: generateDownloadUrlMutation.mutateAsync,
    isDeleting: deleteAttachmentMutation.isPending,
  };
};
