import React from 'react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface CertificateTemplateProps {
  userName: string;
  courseName: string;
  completionDate: string;
  certificateNumber: string;
}

export const CertificateTemplate = React.forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ userName, courseName, completionDate, certificateNumber }, ref) => {
    const formattedDate = format(new Date(completionDate), 'd MMMM yyyy', { locale: th });

    return (
      <div
        ref={ref}
        className="w-[800px] h-[600px] bg-white border-8 border-primary/20 relative flex flex-col items-center justify-center p-12"
        style={{ 
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Decorative border */}
        <div className="absolute inset-4 border-2 border-primary/30 rounded-lg"></div>
        
        {/* Logo */}
        <div className="mb-8">
          <div className="text-3xl font-bold text-primary">Begins.guide</div>
          <div className="text-sm text-muted-foreground text-center">เส้นทางสู่ความสำเร็จทางธุรกิจ</div>
        </div>

        {/* Certificate Title */}
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          ใบรับรองการสำเร็จการศึกษา
        </h1>

        {/* Certificate Content */}
        <div className="text-center space-y-6 flex-1">
          <p className="text-lg text-foreground">ขอมอบใบรับรองนี้แก่</p>
          
          <div className="text-3xl font-bold text-primary border-b-2 border-primary/30 pb-2 px-8 inline-block">
            {userName}
          </div>
          
          <p className="text-lg text-foreground max-w-md mx-auto">
            ที่ได้เรียนจบหลักสูตร
          </p>
          
          <div className="text-2xl font-semibold text-primary bg-primary/5 rounded-lg p-4 max-w-lg mx-auto">
            {courseName}
          </div>
          
          <p className="text-base text-muted-foreground">
            เมื่อวันที่ {formattedDate}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end w-full mt-8">
          <div className="text-center">
            <div className="border-b border-muted-foreground w-32 mb-2"></div>
            <p className="text-sm text-muted-foreground">ผู้ก่อตั้ง</p>
            <p className="text-sm font-semibold">Begins.guide</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">เลขที่ใบรับรอง</p>
            <p className="text-sm font-mono font-semibold text-primary">{certificateNumber}</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-primary/30 rounded-tl-lg"></div>
        <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-primary/30 rounded-tr-lg"></div>
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-primary/30 rounded-bl-lg"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-primary/30 rounded-br-lg"></div>
      </div>
    );
  }
);

CertificateTemplate.displayName = 'CertificateTemplate';