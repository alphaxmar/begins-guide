import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCertificate } from '@/hooks/useCertificate';
import { useCourseData } from '@/hooks/useCourseData';
import { CertificateDownload } from '@/components/certificate/CertificateDownload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Award, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CertificatePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { product } = useCourseData(slug);
  const { 
    canGetCertificate, 
    isCheckingCompletion, 
    certificate, 
    isLoadingCertificate, 
    generateCertificate 
  } = useCertificate(product?.id);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">ไม่พบคอร์สที่ต้องการ</h1>
          <Link to="/courses">
            <Button variant="outline">กลับไปหน้าคอร์ส</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isCheckingCompletion || isLoadingCertificate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">กำลังตรวจสอบข้อมูล...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Award className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">ใบรับรองการสำเร็จการศึกษา</h1>
          <p className="text-muted-foreground">สำหรับคอร์ส: {product.title}</p>
        </div>

        {!canGetCertificate ? (
          <Card className="text-center">
            <CardHeader>
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>คุณยังไม่สามารถรับใบรับรองได้</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                คุณต้องเรียนจบบทเรียนทั้งหมดในคอร์สนี้ก่อนจึงจะสามารถรับใบรับรองได้
              </p>
              <div className="flex gap-4 justify-center">
                <Link to={`/learn/${slug}`}>
                  <Button>กลับไปเรียนต่อ</Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline">ดูคอร์สอื่นๆ</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : certificate ? (
          <div className="space-y-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-green-600">🎉 ยินดีด้วย! คุณได้รับใบรับรองแล้ว</CardTitle>
              </CardHeader>
              <CardContent>
                <CertificateDownload
                  userName={certificate.user.full_name}
                  courseName={product.title}
                  completionDate={certificate.completion_date}
                  certificateNumber={certificate.certificate_number}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="text-center">
            <CardHeader>
              <CardTitle>คุณพร้อมรับใบรับรองแล้ว!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                ยินดีด้วย! คุณได้เรียนจบคอร์สนี้เรียบร้อยแล้ว คลิกปุ่มด้านล่างเพื่อสร้างใบรับรองของคุณ
              </p>
              <Button 
                onClick={() => generateCertificate.mutate(product.id)}
                disabled={generateCertificate.isPending}
                size="lg"
              >
                {generateCertificate.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    กำลังสร้างใบรับรอง...
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5 mr-2" />
                    สร้างใบรับรอง
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}