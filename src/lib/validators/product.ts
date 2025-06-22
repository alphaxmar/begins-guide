
import * as z from "zod";

// Define the product types as a union type to avoid enum issues
const productTypes = [
  "course", 
  "template", 
  "ebook", 
  "video", 
  "software", 
  "service", 
  "membership", 
  "cohort_program"
] as const;

export const productSchema = z.object({
  title: z.string().min(3, { message: "ชื่อสินค้าต้องมีอย่างน้อย 3 ตัวอักษร" }),
  slug: z.string().min(3, { message: "Slug ต้องมีอย่างน้อย 3 ตัวอักษร" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug สามารถมีได้แค่ตัวอักษรเล็ก, ตัวเลข, และขีดกลาง (-)" }),
  description: z.string().optional(),
  price: z.coerce.number().int({ message: "ราคาต้องเป็นจำนวนเต็ม" }).min(0, { message: "ราคาต้องไม่ติดลบ" }),
  product_type: z.enum(productTypes, { 
    required_error: "กรุณาเลือกประเภทสินค้า" 
  }),
  image_url: z.string().url({ message: "URL รูปภาพไม่ถูกต้อง" }).optional().or(z.literal('')),
  image_file: z.instanceof(FileList).optional(),
  template_file: z.instanceof(FileList).optional(),
  template_file_path: z.string().optional(),
  
  // ฟิลด์ใหม่สำหรับการจัดการทั่วไป
  category: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  certificate_enabled: z.boolean().default(false),
  download_limit: z.coerce.number().min(1).optional(),
  download_expiry_hours: z.coerce.number().min(1).default(24),
  
  // ฟิลด์เพิ่มเติมสำหรับคอร์ส
  difficulty_level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  duration_hours: z.coerce.number().min(0).optional(),
  duration_minutes: z.coerce.number().min(0).max(59).optional(),
  what_you_learn: z.string().optional(),
  prerequisites: z.string().optional(),
});
