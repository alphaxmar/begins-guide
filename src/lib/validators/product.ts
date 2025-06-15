
import * as z from "zod";

export const productSchema = z.object({
  title: z.string().min(3, { message: "ชื่อสินค้าต้องมีอย่างน้อย 3 ตัวอักษร" }),
  slug: z.string().min(3, { message: "Slug ต้องมีอย่างน้อย 3 ตัวอักษร" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug สามารถมีได้แค่ตัวอักษรเล็ก, ตัวเลข, และขีดกลาง (-)" }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: "ราคาต้องไม่ติดลบ" }),
  product_type: z.enum(["course", "template"], { required_error: "กรุณาเลือกประเภทสินค้า" }),
  image_url: z.string().url({ message: "URL รูปภาพไม่ถูกต้อง" }).optional().or(z.literal('')),
  template_file: z.instanceof(FileList).optional(),
  template_file_path: z.string().optional(),
});
