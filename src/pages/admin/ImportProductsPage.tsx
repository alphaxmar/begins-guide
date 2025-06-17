
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Download, Upload, Package, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

const ImportProductsPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);

  const downloadTemplate = () => {
    const headers = ["title", "description", "price", "product_type", "image_url"];
    const csvContent = [
      headers.join(","),
      `"คอร์สเริ่มต้นธุรกิจออนไลน์","เรียนรู้การสร้างธุรกิจออนไลน์ตั้งแต่เริ่มต้น","2990","course","https://example.com/course1.jpg"`,
      `"เทมเพลต Business Model Canvas","เทมเพลต BMC สำหรับวางแผนธุรกิจ","590","template","https://example.com/template1.jpg"`
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products_template.csv";
    link.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setResult(null);
    } else {
      toast.error("กรุณาเลือกไฟล์ CSV เท่านั้น");
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const row: any = {};
        
        headers.forEach((header, index) => {
          if (values[index]) {
            row[header] = values[index].replace(/"/g, '').trim();
          }
        });
        
        if (row.title) {
          data.push(row);
        }
      }
    }
    
    return data;
  };

  const importProducts = async () => {
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setResult(null);

    try {
      const text = await file.text();
      const products = parseCSV(text);
      
      if (products.length === 0) {
        toast.error("ไม่พบข้อมูลสินค้าในไฟล์ CSV");
        setImporting(false);
        return;
      }

      const results: ImportResult = {
        success: 0,
        failed: 0,
        errors: []
      };

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        setProgress(((i + 1) / products.length) * 100);

        try {
          // Validate required fields
          if (!product.title || !product.price) {
            throw new Error(`แถวที่ ${i + 2}: ต้องมี title และ price`);
          }

          // Validate product_type
          if (product.product_type && !['course', 'template'].includes(product.product_type)) {
            throw new Error(`แถวที่ ${i + 2}: product_type ต้องเป็น 'course' หรือ 'template'`);
          }

          // Validate price
          const price = parseFloat(product.price);
          if (isNaN(price) || price < 0) {
            throw new Error(`แถวที่ ${i + 2}: ราคาต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0`);
          }

          const slug = generateSlug(product.title);
          
          // Check if product with same slug exists
          const { data: existingProduct } = await supabase
            .from("products")
            .select("id")
            .eq("slug", slug)
            .single();

          if (existingProduct) {
            throw new Error(`สินค้าที่มี slug "${slug}" มีอยู่แล้ว`);
          }

          // Insert product
          const { error } = await supabase
            .from("products")
            .insert({
              title: product.title,
              description: product.description || null,
              price: price,
              product_type: product.product_type || 'course',
              image_url: product.image_url || null,
              slug: slug
            });

          if (error) throw error;
          results.success++;

        } catch (error) {
          results.failed++;
          results.errors.push(`แถวที่ ${i + 2}: ${error instanceof Error ? error.message : 'เกิดข้อผิดพลาด'}`);
        }
      }

      setResult(results);
      
      if (results.success > 0) {
        toast.success(`นำเข้าสินค้าสำเร็จ ${results.success} รายการ`);
      }
      
      if (results.failed > 0) {
        toast.error(`นำเข้าไม่สำเร็จ ${results.failed} รายการ`);
      }

    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV");
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปจัดการสินค้า
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold">นำเข้าสินค้าจาก CSV</h1>
        <p className="text-muted-foreground">อัปโหลดไฟล์ CSV เพื่อเพิ่มสินค้าจำนวนมากในครั้งเดียว</p>
      </div>

      <div className="grid gap-6">
        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              วิธีการใช้งาน
            </CardTitle>
            <CardDescription>
              ทำตามขั้นตอนด้านล่างเพื่อนำเข้าสินค้าอย่างถูกต้อง
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <p className="font-medium">ดาวน์โหลดไฟล์ตัวอย่าง</p>
                  <p className="text-sm text-muted-foreground">ดาวน์โหลดไฟล์ CSV ตัวอย่างเพื่อดูรูปแบบที่ถูกต้อง</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <p className="font-medium">เตรียมข้อมูลของคุณ</p>
                  <p className="text-sm text-muted-foreground">แก้ไขไฟล์ CSV ให้มีข้อมูลสินค้าของคุณ (title และ price จำเป็น)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <p className="font-medium">อัปโหลดและนำเข้า</p>
                  <p className="text-sm text-muted-foreground">เลือกไฟล์ที่เตรียมไว้และกดปุ่มนำเข้าข้อมูล</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              ดาวน์โหลดไฟล์ตัวอย่าง (CSV Template)
            </Button>
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>อัปโหลดไฟล์ CSV</CardTitle>
            <CardDescription>
              เลือกไฟล์ CSV ที่มีข้อมูลสินค้าที่ต้องการนำเข้า
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="csv-file">ไฟล์ CSV</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={importing}
              />
            </div>

            {file && (
              <Alert>
                <Package className="h-4 w-4" />
                <AlertDescription>
                  เลือกไฟล์: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </AlertDescription>
              </Alert>
            )}

            {importing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>กำลังนำเข้าข้อมูล...</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button 
              onClick={importProducts} 
              disabled={!file || importing}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? "กำลังนำเข้า..." : "เริ่มนำเข้าข้อมูล"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Card */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success > 0 && result.failed === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                ผลการนำเข้าข้อมูล
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{result.success}</div>
                  <div className="text-sm text-green-700">สำเร็จ</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{result.failed}</div>
                  <div className="text-sm text-red-700">ไม่สำเร็จ</div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">รายละเอียดข้อผิดพลาด:</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {result.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700 mb-1">
                        • {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.success > 0 && (
                <Button asChild className="w-full">
                  <Link to="/admin/products">
                    ดูสินค้าที่นำเข้าแล้ว
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImportProductsPage;
