
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export interface ArticleFormValues {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  category_id: string;
  status: 'draft' | 'published';
  is_featured_on_hub: boolean;
  recommended_product_id: string;
  seo_title: string;
  seo_description: string;
}

interface ArticleFormProps {
  onSubmit: (values: ArticleFormValues) => void;
  isPending?: boolean;
  submitButtonText?: string;
  initialValues?: Partial<ArticleFormValues>;
  isSlugDisabled?: boolean;
}

type Category = Tables<'categories'>;
type ProductForDropdown = {
  id: string;
  title: string;
  product_type: string;
};

const ArticleForm = ({
  onSubmit,
  isPending = false,
  submitButtonText = "บันทึก",
  initialValues,
  isSlugDisabled = false,
}: ArticleFormProps) => {
  const [formData, setFormData] = useState<ArticleFormValues>({
    title: initialValues?.title || "",
    slug: initialValues?.slug || "",
    content: initialValues?.content || "",
    excerpt: initialValues?.excerpt || "",
    cover_image_url: initialValues?.cover_image_url || "",
    category_id: initialValues?.category_id || "",
    status: initialValues?.status || 'draft',
    is_featured_on_hub: initialValues?.is_featured_on_hub || false,
    recommended_product_id: initialValues?.recommended_product_id || "",
    seo_title: initialValues?.seo_title || "",
    seo_description: initialValues?.seo_description || "",
  });

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch products for recommended product dropdown
  const { data: products } = useQuery<ProductForDropdown[]>({
    queryKey: ['products-dropdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, product_type')
        .order('title');
      
      if (error) throw error;
      return data;
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!isSlugDisabled && formData.title && !initialValues?.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isSlugDisabled, initialValues?.slug]);

  // Auto-generate SEO title from title if not set
  useEffect(() => {
    if (formData.title && !formData.seo_title) {
      setFormData(prev => ({ ...prev, seo_title: formData.title }));
    }
  }, [formData.title, formData.seo_title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof ArticleFormValues, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">ชื่อบทความ *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="เช่น: 10 วิธีเริ่มต้นธุรกิจออนไลน์"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="how-to-start-online-business"
              disabled={isSlugDisabled}
              required
            />
            <p className="text-xs text-muted-foreground">
              URL ของบทความ: /articles/{formData.slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">คำโปรย</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="คำอธิบายสั้นๆ ของบทความ"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image_url">รูปปก</Label>
            <Input
              id="cover_image_url"
              value={formData.cover_image_url}
              onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>เนื้อหา</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="content">เนื้อหาบทความ</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="เขียนเนื้อหาบทความของคุณที่นี่... (รองรับ HTML)"
              rows={15}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              รองรับ HTML Tags: h2, h3, p, strong, em, ul, ol, li, a, img
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Categorization & Settings */}
      <Card>
        <CardHeader>
          <CardTitle>หมวดหมู่และการตั้งค่า</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_id">หมวดหมู่</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => handleInputChange('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommended_product_id">สินค้าที่แนะนำ (ไม่บังคับ)</Label>
            <Select
              value={formData.recommended_product_id}
              onValueChange={(value) => handleInputChange('recommended_product_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกสินค้าที่ต้องการแนะนำ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ไม่แนะนำสินค้าใด</SelectItem>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title} ({product.product_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              สินค้าที่เลือกจะแสดงใน Sidebar ของบทความ
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">สถานะ</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'draft' | 'published') => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">ร่าง</SelectItem>
                <SelectItem value="published">เผยแพร่</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured_on_hub"
              checked={formData.is_featured_on_hub}
              onCheckedChange={(checked) => handleInputChange('is_featured_on_hub', checked)}
            />
            <Label htmlFor="is_featured_on_hub">
              แสดงในส่วน "เริ่มต้นที่นี่" ของหน้าคลังความรู้
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>การตั้งค่า SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo_title">SEO Title</Label>
            <Input
              id="seo_title"
              value={formData.seo_title}
              onChange={(e) => handleInputChange('seo_title', e.target.value)}
              placeholder="ชื่อที่จะแสดงใน Google Search"
            />
            <p className="text-xs text-muted-foreground">
              ความยาวที่แนะนำ: 50-60 ตัวอักษร (ปัจจุบัน: {formData.seo_title.length})
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_description">SEO Description</Label>
            <Textarea
              id="seo_description"
              value={formData.seo_description}
              onChange={(e) => handleInputChange('seo_description', e.target.value)}
              placeholder="คำอธิบายที่จะแสดงใน Google Search"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              ความยาวที่แนะนำ: 150-160 ตัวอักษร (ปัจจุบัน: {formData.seo_description.length})
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "กำลังบันทึก..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default ArticleForm;
