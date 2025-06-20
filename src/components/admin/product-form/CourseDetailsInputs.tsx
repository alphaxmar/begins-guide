
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormValues } from "../ProductForm";

interface CourseDetailsInputsProps {
  control: Control<ProductFormValues>;
}

const CourseDetailsInputs: React.FC<CourseDetailsInputsProps> = ({ control }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="difficulty_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ระดับความยาก</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกระดับความยาก" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="beginner">มือใหม่</SelectItem>
                <SelectItem value="intermediate">ปานกลาง</SelectItem>
                <SelectItem value="advanced">ขั้นสูง</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              ระดับความยากของคอร์สนี้เหมาะสำหรับใคร
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="duration_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ระยะเวลา (ชั่วโมง)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="2" 
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="duration_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ระยะเวลา (นาที)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="30" 
                  min="0"
                  max="59"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="what_you_learn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>สิ่งที่จะได้เรียนรู้</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="อธิบายว่าผู้เรียนจะได้เรียนรู้อะไรจากคอร์สนี้..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              รายละเอียดสิ่งที่ผู้เรียนจะได้รับจากคอร์สนี้
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="prerequisites"
        render={({ field }) => (
          <FormItem>
            <FormLabel>เงื่อนไขพื้นฐาน</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="ความรู้หรือทักษะที่ผู้เรียนต้องมีก่อนเรียนคอร์สนี้..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              ความรู้พื้นฐานที่ผู้เรียนควรมีก่อนเรียนคอร์สนี้
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CourseDetailsInputs;
