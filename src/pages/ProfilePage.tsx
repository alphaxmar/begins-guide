
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, FileDown } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

const profileSchema = z.object({
  full_name: z.string().min(2, { message: "ชื่อ-นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร" }).optional(),
  avatar_url: z.string().url({ message: "กรุณาใส่ URL ของรูปภาพที่ถูกต้อง" }).optional().or(z.literal('')),
});

type PurchasedItem = Tables<'user_purchases'> & {
  products: Tables<'products'> | null;
}

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("คุณต้องเข้าสู่ระบบก่อน");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116: The result contains 0 rows
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user,
  });

  const { data: purchasedItems, isLoading: purchasedItemsLoading, error: purchasedItemsError } = useQuery<PurchasedItem[]>({
    queryKey: ['purchased_products', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          id,
          product_id,
          products (
            id,
            title,
            slug,
            product_type,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data.filter(item => item.products) as PurchasedItem[];
    },
    enabled: !!user,
  });


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
    onSuccess: () => {
      toast.success("อัปเดตโปรไฟล์สำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user'] }); // To update avatar in header
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate(values);
  };
  
  if (authLoading || profileLoading) {
    return <div className="text-center py-12">กำลังโหลดข้อมูลโปรไฟล์...</div>;
  }

  if (profileError) {
    return <div className="text-center py-12 text-destructive">เกิดข้อผิดพลาดในการโหลดข้อมูล: {profileError.message}</div>;
  }
  
  if (!user) return null;

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>โปรไฟล์ของคุณ</CardTitle>
          <CardDescription>จัดการข้อมูลส่วนตัวและดูสินค้าของคุณ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
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

          <div className="mt-8 border-t pt-8">
            <h3 className="text-xl font-semibold mb-4">สินค้าของฉัน</h3>
            
            {purchasedItemsLoading && (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
            )}

            {purchasedItemsError && (
              <p className="text-destructive">เกิดข้อผิดพลาดในการโหลดสินค้า: {purchasedItemsError.message}</p>
            )}

            {!purchasedItemsLoading && !purchasedItemsError && (
              purchasedItems && purchasedItems.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {purchasedItems.map((item) => (
                    item.products && (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="flex">
                          <img src={item.products.image_url || '/placeholder.svg'} alt={item.products.title} className="w-28 h-28 object-cover" />
                          <div className="p-4 flex flex-col justify-between flex-grow">
                            <div>
                              <h4 className="font-semibold">{item.products.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.products.product_type === 'course' ? 'คอร์สออนไลน์' : 'เทมเพลต'}</p>
                            </div>
                            {item.products.product_type === 'course' ? (
                              <Button asChild size="sm" className="mt-2 self-start">
                                <Link to={`/learn/course/${item.products.slug}`}>
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  เข้าเรียน
                                </Link>
                              </Button>
                            ) : (
                              <Button size="sm" className="mt-2 self-start" disabled>
                                <FileDown className="mr-2 h-4 w-4" />
                                ดาวน์โหลด
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                  <h4 className="text-lg font-semibold">ยังไม่มีสินค้า</h4>
                  <p className="text-muted-foreground mt-1 mb-4">เลือกซื้อคอร์สเรียนหรือเทมเพลตเพื่อเริ่มต้นเส้นทางของคุณ</p>
                  <Button asChild>
                    <Link to="/products">เลือกชมสินค้าทั้งหมด</Link>
                  </Button>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
