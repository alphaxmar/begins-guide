import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tables } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";

const profileSchema = z.object({
  full_name: z.string().min(2, { message: "ชื่อ-นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร" }).optional(),
  avatar_url: z.string().optional().or(z.literal('')),
});

interface ProfileFormProps {
  user: User;
  profile: Tables<'profiles'> | null;
}

const ProfileForm = ({ user, profile }: ProfileFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      avatar_url: "",
    },
  });
  
  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: z.infer<typeof profileSchema>) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updatedProfile,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('อัพเดทโปรไฟล์สำเร็จ');
    },
    onError: (error) => {
      console.error('Update profile error:', error);
      toast.error('เกิดข้อผิดพลาดในการอัพเดทโปรไฟล์');
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    updateProfileMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อ-นามสกุล</FormLabel>
              <FormControl>
                <Input placeholder="ใส่ชื่อ-นามสกุลของคุณ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รูปโปรไฟล์</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={field.value || user.user_metadata?.avatar_url} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            toast.error('ขนาดไฟล์ต้องไม่เกิน 2MB');
                            return;
                          }

                          const fileExt = file.name.split('.').pop();
                          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                          
                          toast.loading('กำลังอัพโหลดรูปภาพ...');
                          
                          const { error: uploadError, data } = await supabase.storage
                            .from('avatars')
                            .upload(fileName, file);
                          
                          if (uploadError) {
                            toast.error('อัพโหลดรูปภาพไม่สำเร็จ');
                            return;
                          }

                          if (data) {
                            const { data: { publicUrl } } = supabase.storage
                              .from('avatars')
                              .getPublicUrl(data.path);
                            field.onChange(publicUrl);
                            toast.success('อัพโหลดรูปภาพสำเร็จ');
                          }
                        }
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      อัพโหลดรูปโปรไฟล์ขนาดไม่เกิน 2MB
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={updateProfileMutation.isPending}
          className="w-full md:w-auto"
        >
          {updateProfileMutation.isPending ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
