
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTemplateDownload = () => {
  return useMutation<
    { url: string; filename: string },
    Error,
    string
  >({
    mutationFn: async (filePath: string) => {
      if (!filePath) {
        throw new Error("ไม่พบที่อยู่ไฟล์สำหรับดาวน์โหลด");
      }
      
      const { data, error } = await supabase
        .storage
        .from('product_files')
        .createSignedUrl(filePath, 60); // 60 seconds validity

      if (error) {
        throw new Error(`ไม่สามารถสร้างลิงก์ดาวน์โหลดได้: ${error.message}`);
      }
      
      return { 
        url: data.signedUrl, 
        filename: filePath.split('/').pop() || 'template' 
      };
    },
    onSuccess: ({ url, filename }) => {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link.remove();
      toast.success("กำลังเริ่มดาวน์โหลด...");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
};
