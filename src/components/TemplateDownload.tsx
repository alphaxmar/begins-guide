
import TemplateDownloadButton from "@/components/template/TemplateDownloadButton";

interface TemplateDownloadProps {
  templatePath: string;
  fileName: string;
  productId: string;
  className?: string;
}

const TemplateDownload = ({ templatePath, fileName, productId, className = "" }: TemplateDownloadProps) => {
  return (
    <TemplateDownloadButton
      templatePath={templatePath}
      fileName={fileName}
      productId={productId}
      className={className}
    />
  );
};

export default TemplateDownload;
