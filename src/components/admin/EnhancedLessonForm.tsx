
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

export const enhancedLessonSchema = z.object({
  title: z.string().min(3, { message: "หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร" }),
  content: z.string().optional(),
  video_url: z.string().url({ message: "กรุณาใส่ URL ที่ถูกต้อง" }).optional().or(z.literal('')),
  unlock_type: z.enum(['sequential', 'date', 'immediate']),
  unlock_date: z.string().optional(),
  is_locked: z.boolean().default(false),
});

export type EnhancedLessonFormValues = z.infer<typeof enhancedLessonSchema>;

interface EnhancedLessonFormProps {
  onSubmit: (values: EnhancedLessonFormValues) => void;
  isLoading: boolean;
  initialData?: Tables<'lessons'> | null;
  submitButtonText?: string;
}

const EnhancedLessonForm = ({
  onSubmit,
  isLoading,
  initialData,
  submitButtonText = "บันทึก",
}: EnhancedLessonFormProps) => {
  const form = useForm<EnhancedLessonFormValues>({
    resolver: zodResolver(enhancedLessonSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      video_url: initialData?.video_url || "",
      unlock_type: (initialData?.unlock_type as 'sequential' | 'date' | 'immediate') || 'sequential',
      unlock_date: initialData?.unlock_date ? new Date(initialData.unlock_date).toISOString().slice(0, 16) : "",
      is_locked: initialData?.is_locked || false,
    },
  });

  const watchedUnlockType = form.watch("unlock_type");

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

        <FormField
          control={form.control}
          name="unlock_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ประเภทการปลดล็อก</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทการปลดล็อก" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="immediate">ปลดล็อกทันที</SelectItem>
                  <SelectItem value="sequential">ปลดล็อกตามลำดับ</SelectItem>
                  <SelectItem value="date">ปลดล็อกตามวันที่</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                กำหนดเงื่อนไขการเข้าถึงบทเรียนนี้
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchedUnlockType === 'date' && (
          <FormField
            control={form.control}
            name="unlock_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>วันที่ปลดล็อก</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormDescription>
                  บทเรียนจะถูกปลดล็อกในวันเวลาที่กำหนด
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="is_locked"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  ล็อกบทเรียน
                </FormLabel>
                <FormDescription>
                  ป้องกันไม่ให้ผู้เรียนเข้าถึงบทเรียนนี้ชั่วคราว
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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

export default EnhancedLessonForm;
