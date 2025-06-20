
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TemplateDownloadProps {
  templatePath: string;
  productTitle: string;
  className?: string;
}

const TemplateDownload = ({ templatePath, productTitle, className = "" }: TemplateDownloadProps) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!templatePath) {
      toast.error("ไม่พบไฟล์เทมเพลต");
      return;
    }

    setDownloading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('template-files')
        .download(templatePath);

      if (error) {
        throw error;
      }

      // สร้าง URL สำหรับดาวน์โหลด
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      
      // กำหนดชื่อไฟล์
      const fileName = templatePath.split('/').pop() || `${productTitle}.pdf`;
      link.download = fileName;
      
      // ดำเนินการดาวน์โหลด
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("ดาวน์โหลดเทมเพลตสำเร็จ");
    } catch (err: any) {
      console.error("Download error:", err);
      toast.error("เกิดข้อผิดพลาดในการดาวน์โหลด");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={downloading || !templatePath}
      variant="outline"
      className={className}
    >
      {downloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          กำลังดาวน์โหลด...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          ดาวน์โหลดเทมเพลต
        </>
      )}
    </Button>
  );
};

export default TemplateDownload;
