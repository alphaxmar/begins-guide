
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
  avatar_url: z.string().url({ message: "กรุณาใส่ URL ของรูปภาพที่ถูกต้อง" }).optional().or(z.literal('')),
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
        .update({
          full_name: updatedProfile.full_name,
          avatar_url: updatedProfile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success("อัปเดตโปรไฟล์สำเร็จ!");
      queryClient.setQueryData(['profile', user?.id], data);
      queryClient.invalidateQueries({ queryKey: ['user'] }); // To update avatar in header
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate(values);
  };

  return (
    <div>
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={form.watch('avatar_url') || user.user_metadata?.avatar_url} alt={user.email ?? ''} />
          <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{form.watch('full_name') || 'ผู้ใช้ใหม่'}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อ-นามสกุล</FormLabel>
                  <FormControl>
                    <Input placeholder="ชื่อ-นามสกุลของคุณ" {...field} />
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
                  <FormLabel>URL รูปโปรไฟล์</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileForm;
