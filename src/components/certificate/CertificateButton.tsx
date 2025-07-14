import React from 'react';
import { useCertificate } from '@/hooks/useCertificate';
import { Button } from '@/components/ui/button';
import { Award, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CertificateButtonProps {
  courseId: string;
  courseSlug: string;
  className?: string;
}

export const CertificateButton: React.FC<CertificateButtonProps> = ({ 
  courseId, 
  courseSlug,
  className = ""
}) => {
  const { canGetCertificate, certificate, generateCertificate } = useCertificate(courseId);

  if (!canGetCertificate) {
    return null; // Don't show anything if user can't get certificate yet
  }

  if (certificate) {
    return (
      <Link to={`/certificate/${courseSlug}`}>
        <Button variant="outline" className={`flex items-center gap-2 ${className}`}>
          <Award className="w-4 h-4 text-yellow-600" />
          <span>ดูใบรับรอง</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
      </Link>
    );
  }

  return (
    <Button 
      onClick={() => generateCertificate.mutate(courseId)}
      disabled={generateCertificate.isPending}
      className={`flex items-center gap-2 ${className}`}
      variant="default"
    >
      <Award className="w-4 h-4" />
      {generateCertificate.isPending ? 'กำลังสร้าง...' : 'รับใบรับรอง'}
    </Button>
  );
};