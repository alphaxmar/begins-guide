
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

export const lessonSchema = z.object({
  title: z.string().min(3, { message: "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร" }),
  content: z.string().optional(),
  video_url: z.string().url({ message: "กรุณาใส่ URL ที่ถูกต้อง" }).optional().or(z.literal('')),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonFormProps {
  onSubmit: (values: LessonFormValues) => void;
  isLoading: boolean;
  initialData?: Tables<'lessons'> | null;
  submitButtonText?: string;
}

const LessonForm = ({
  onSubmit,
  isLoading,
  initialData,
  submitButtonText = "บันทึก",
}: LessonFormProps) => {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      video_url: initialData?.video_url || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>หัวข้อบทเรียน</FormLabel>
              <FormControl>
                <Input placeholder="เช่น: บทนำ, การตลาดเบื้องต้น" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เนื้อหาประกอบ</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ใส่เนื้อหาเพิ่มเติม หรือลิงก์ดาวน์โหลดเอกสาร"
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="video_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ลิงก์วิดีโอ (URL)</FormLabel>
              <FormControl>
                <Input placeholder="เช่น: https://www.youtube.com/watch?v=..." {...field} />
              </FormControl>
              <FormDescription>
                วาง URL ของวิดีโอจาก YouTube หรือ Vimeo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
};

export default LessonForm;
