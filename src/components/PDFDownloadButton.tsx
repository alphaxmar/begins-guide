import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { Dreamline, DreamlineSummary } from '@/hooks/useDreamlines';

interface PDFDownloadButtonProps {
  dreamlines: Dreamline[];
  summary: DreamlineSummary | null;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  dreamlines,
  summary,
  variant = 'ghost',
  size = 'default',
  className = '',
}) => {
  const { generatePDF, isGenerating } = usePDFGenerator();

  const handleDownload = () => {
    generatePDF(dreamlines, summary);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isGenerating || !summary}
      className={`${className}`}
    >
      {isGenerating ? (
        <>
          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
          กำลังสร้าง PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          ดาวน์โหลดพิมพ์เขียว (PDF)
        </>
      )}
    </Button>
  );
};