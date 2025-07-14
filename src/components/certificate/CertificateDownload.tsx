import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { CertificateTemplate } from './CertificateTemplate';

interface CertificateDownloadProps {
  userName: string;
  courseName: string;
  completionDate: string;
  certificateNumber: string;
}

export const CertificateDownload: React.FC<CertificateDownloadProps> = ({
  userName,
  courseName,
  completionDate,
  certificateNumber,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        width: 800,
        height: 600,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `certificate-${certificateNumber}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success('ใบรับรองถูกดาวน์โหลดเรียบร้อยแล้ว!');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้างใบรับรอง');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <CertificateTemplate
        ref={certificateRef}
        userName={userName}
        courseName={courseName}
        completionDate={completionDate}
        certificateNumber={certificateNumber}
      />
      
      <Button onClick={downloadCertificate} size="lg" className="flex items-center gap-2">
        <Download className="w-5 h-5" />
        ดาวน์โหลดใบรับรอง
      </Button>
    </div>
  );
};