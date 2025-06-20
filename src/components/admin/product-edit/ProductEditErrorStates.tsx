
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductEditErrorStatesProps {
  type: 'no-slug' | 'error' | 'not-found';
  slug?: string;
  errorMessage?: string;
}

const ProductEditErrorStates = ({ type, slug, errorMessage }: ProductEditErrorStatesProps) => {
  const navigate = useNavigate();

  if (type === 'no-slug') {
    return (
      <div className="py-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">ไม่พบ slug ของสินค้าใน URL</p>
            <p className="text-sm text-muted-foreground mt-2">
              กรุณาตรวจสอบ URL ให้ถูกต้อง
            </p>
            <div className="mt-4">
              <Button onClick={() => navigate("/admin/products")}>
                กลับไปรายการสินค้า
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="py-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">เกิดข้อผิดพลาด: {errorMessage}</p>
            <p className="text-sm text-muted-foreground mt-2">
              ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง
            </p>
            <div className="mt-4">
              <Button onClick={() => window.location.reload()}>
                ลองใหม่
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === 'not-found') {
    return (
      <div className="py-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">ไม่พบสินค้าที่ต้องการแก้ไข</p>
            <p className="text-sm text-muted-foreground mt-2">
              Slug: {slug}
            </p>
            <div className="mt-4">
              <Button onClick={() => navigate("/admin/products")}>
                กลับไปรายการสินค้า
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default ProductEditErrorStates;
