
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TemplateDownloadProps {
  templatePath: string;
  fileName: string;
  className?: string;
}

const TemplateDownload = ({ templatePath, fileName, className = "" }: TemplateDownloadProps) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('product_templates')
        .download(templatePath);

      if (error) {
        throw error;
      }

      // Create blob URL and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("ดาวน์โหลดเทมเพลตสำเร็จ!");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error("เกิดข้อผิดพลาดในการดาวน์โหลด: " + error.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={downloading}
      className={className}
      variant="outline"
    >
      {downloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          กำลังดาวน์โหลด...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          <FileText className="mr-2 h-4 w-4" />
          ดาวน์โหลด {fileName}
        </>
      )}
    </Button>
  );
};

export default TemplateDownload;
