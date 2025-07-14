import React from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { useAdvancedCourseAccess } from "@/hooks/useAdvancedCourseAccess";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import {
  CheckCircle,
  Clock,
  Users,
  PlayCircle,
  ArrowLeft,
  Star,
  BookOpen,
  ShoppingCart,
  Shield,
  Target,
  Gift,
  Loader2,
  MessageSquare,
  User,
  Video,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PaymentOptions from "@/components/payment/PaymentOptions";
import RatingDisplay from "@/components/reviews/RatingDisplay";

const fetchProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("product_type", "course")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

const fetchLessons = async (productId: string) => {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("product_id", productId)
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
};

// Mock function to fetch reviews - will be replaced with real data
const fetchCourseReviews = async (productId: string) => {
  // This will be connected to real reviews system in Task 2.2
  return [
    {
      id: "1",
      user: { full_name: "นาย ธนกร ใจดี", avatar_url: null },
      rating: 5,
      comment: "คอร์สนี้ช่วยให้ผมเข้าใจการทำธุรกิจมากขึ้น และสามารถนำไปปรับใช้กับบริษัทได้จริง",
      created_at: "2024-01-15"
    },
    {
      id: "2", 
      user: { full_name: "คุณ สมใจ ประสบผล", avatar_url: null },
      rating: 5,
      comment: "เนื้อหาครบครัน เข้าใจง่าย และที่สำคัญคือใช้ได้จริง ขอบคุณมากครับ",
      created_at: "2024-01-20"
    },
    {
      id: "3",
      user: { full_name: "นางสาว ปิยดา สำเร็จ", avatar_url: null },
      rating: 5,
      comment: "คอร์สที่ดีที่สุดที่เคยเรียน คุ้มค่ากับเงินที่จ่ายไป และได้ความรู้เยอะมาก",
      created_at: "2024-01-25"
    }
  ];
};

const CourseSalesPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: course, isLoading, isError } = useQuery<Tables<'products'> | null>({
    queryKey: ["course", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", course?.id],
    queryFn: () => fetchLessons(course!.id),
    enabled: !!course?.id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["course-reviews", course?.id],
    queryFn: () => fetchCourseReviews(course!.id),
    enabled: !!course?.id,
  });

  const { hasAccess, isLoading: isAccessLoading, accessType, isVip } = useAdvancedCourseAccess(
    course?.id
  );

  // Mutation for claiming free courses
  const claimFreeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("user_purchases")
        .insert([{ user_id: user.id, product_id: productId }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("เพิ่มคอร์สเข้าบัญชีของคุณแล้ว!");
      queryClient.invalidateQueries({ queryKey: ["purchaseStatus"] });
      queryClient.invalidateQueries({ queryKey: ["courseAccess"] });
    },
    onError: (error: any) => {
      if (error.message.includes("duplicate")) {
        toast.info("คุณมีคอร์สนี้อยู่แล้ว");
      } else {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบคอร์สที่คุณค้นหา</h1>
          <p className="text-gray-600 mb-8">คอร์สนี้อาจถูกลบหรือย้ายไปแล้ว</p>
          <Button asChild>
            <Link to="/products">กลับไปหน้าคอร์สทั้งหมด</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isFree = course.price === 0;
  const totalLessons = lessons.length;
  const estimatedHours = Math.ceil(totalLessons * 0.5); // ประมาณ 30 นาทีต่อบทเรียน
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  // Learning outcomes based on course content
  const learningOutcomes = [
    "เรียนรู้ได้ทุกที่ทุกเวลา ไม่มีข้อจำกัด",
    "ได้ใบรับรองหลังจบคอร์ส", 
    "เข้าถึงเนื้อหาได้ตลอดชีวิต",
    "มีไฟล์เสริมและเทมเพลตให้ดาวน์โหลด",
    "สามารถนำไปปฏิบัติได้จริง",
    "อัปเดตเนื้อหาใหม่ฟรี"
  ];

  // FAQ data
  const faqs = [
    {
      question: "คอร์สนี้เหมาะกับใคร?",
      answer: "เหมาะสำหรับผู้ที่ต้องการเริ่มต้นทำธุรกิจ คนทำงานประจำที่ต้องการรายได้เสริม หรือผู้ประกอบการที่ต้องการพัฒนาธุรกิจให้เติบโต"
    },
    {
      question: "ต้องมีความรู้พื้นฐานมาก่อนไหม?",
      answer: "ไม่จำเป็นครับ เราออกแบบคอร์สให้เริ่มต้นจากพื้นฐาน เข้าใจง่าย และสามารถนำไปปฏิบัติได้จริง"
    },
    {
      question: "เรียนแล้วจะสามารถทำธุรกิจได้จริงไหม?",
      answer: "คอร์สนี้ให้ความรู้และเครื่องมือที่จำเป็น แต่ความสำเร็จขึ้นอยู่กับการนำไปปฏิบัติและความตั้งใจของแต่ละคน"
    },
    {
      question: "มีการสนับสนุนหลังการเรียนไหม?",
      answer: "มีครับ สามารถถามคำถามได้ในชุมชนของเรา และทีมงานจะช่วยตอบข้อสงสัย"
    },
    {
      question: "สามารถขอใบรับรองได้ไหม?",
      answer: "ได้ครับ หลังจากเรียนจบทุกบทเรียนแล้ว ระบบจะออกใบรับรองให้อัตโนมัติ"
    }
  ];

  const handleAddToCart = () => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนเพิ่มลงตะกร้า");
      navigate("/auth");
      return;
    }

    if (isFree) {
      claimFreeMutation.mutate(course.id);
    } else {
      addToCart(course);
      toast.success("เพิ่มคอร์สลงในตะกร้าแล้ว");
    }
  };

  const handleStartLearning = () => {
    navigate(`/courses/${course.slug}/learn`);
  };

  const renderActionButton = () => {
    if (isAccessLoading) {
      return (
        <Button size="lg" disabled className="w-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          กำลังตรวจสอบ...
        </Button>
      );
    }

    if (hasAccess) {
      return (
        <Button size="lg" onClick={handleStartLearning} className="w-full bg-green-600 hover:bg-green-700">
          <PlayCircle className="mr-2 h-5 w-5" />
          เริ่มเรียนเลย
        </Button>
      );
    }

    return (
      <div className="space-y-4">
        {!isFree && (
          <Button 
            size="lg" 
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            เพิ่มลงตะกร้า - ฿{course.price.toLocaleString()}
          </Button>
        )}
        
        {isFree && (
          <Button 
            size="lg" 
            onClick={handleAddToCart}
            disabled={claimFreeMutation.isPending}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {claimFreeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังเพิ่ม...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-5 w-5" />
                รับคอร์สฟรี
              </>
            )}
          </Button>
        )}

        <PaymentOptions 
          productIds={[course.id]}
          amount={course.price}
          onSuccess={() => {
            toast.success("ชำระเงินสำเร็จ!");
            queryClient.invalidateQueries({ queryKey: ["courseAccess"] });
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-4">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้าคอร์สทั้งหมด
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Course Image */}
          <div className="space-y-6">
            <div className="relative">
              <img 
                src={course.image_url || `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(course.title)}`}
                alt={course.title}
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute top-4 left-4">
                {isFree ? (
                  <Badge className="bg-green-500 text-white">ฟรี</Badge>
                ) : (
                  <Badge className="bg-blue-500 text-white">คอร์สพรีเมียม</Badge>
                )}
              </div>
            </div>

            {/* Course Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{totalLessons} บทเรียน</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>ประมาณ {estimatedHours} ชั่วโมง</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{reviews.length > 0 ? `${reviews.length}+ คนเรียนแล้ว` : "เปิดใหม่"}</span>
              </div>
              {averageRating > 0 && (
                <RatingDisplay rating={averageRating} size="sm" />
              )}
            </div>
          </div>

          {/* Right: Course Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {course.description || "เรียนรู้ทักษะที่จำเป็นสำหรับการสร้างธุรกิจที่ประสบความสำเร็จ"}
              </p>
            </div>

            {/* Price & CTA */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="text-center space-y-4">
                {!isFree && (
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      ฿{course.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">ครั้งเดียว เรียนได้ตลอดชีวิต</div>
                  </div>
                )}
                
                {renderActionButton()}
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="h-4 w-4" />
                  <span>รับประกันความพึงพอใจ 30 วัน</span>
                </div>
              </div>
            </Card>

            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  สิ่งที่คุณจะได้เรียนรู้
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {learningOutcomes.slice(0, 4).map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            คอร์สนี้เหมาะกับใคร?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ผู้เริ่มต้นธุรกิจ</h3>
              <p className="text-gray-600">
                สำหรับคุณที่ต้องการเริ่มต้นธุรกิจแต่ไม่รู้จะเริ่มยังไง
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">คนทำงานประจำ</h3>
              <p className="text-gray-600">
                ต้องการรายได้เสริมหรือเตรียมตัวลาออกมาทำธุรกิจ
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ผู้ประกอบการเดิม</h3>
              <p className="text-gray-600">
                ต้องการพัฒนาธุรกิจให้เติบโตและมีกำไรมากขึ้น
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Curriculum Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            เนื้อหาในคอร์ส
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {totalLessons} บทเรียน • ประมาณ {estimatedHours} ชั่วโมง
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        {lesson.content && (
                          <p className="text-sm text-gray-600 mt-1">{lesson.content.substring(0, 100)}...</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {lesson.video_url && <Video className="h-4 w-4" />}
                        <Clock className="h-4 w-4" />
                        <span>30 นาที</span>
                      </div>
                    </div>
                  ))}
                  
                  {lessons.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>กำลังเตรียมเนื้อหาคอร์ส</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Instructor Bio Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            เกี่ยวกับผู้สอน
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="/placeholder.svg" alt="Instructor" />
                    <AvatarFallback className="text-2xl">BG</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Begins.guide Team</h3>
                    <p className="text-blue-600 font-medium mb-4">ผู้เชี่ยวชาญด้านการสร้างธุรกิจ</p>
                    <p className="text-gray-600 leading-relaxed">
                      ทีมงาน Begins.guide มีประสบการณ์กว่า 10 ปีในการช่วยเหลือผู้ประกอบการหน้าใหม่
                      ให้สามารถเริ่มต้นและพัฒนาธุรกิจได้อย่างยั่งยืน เราเชื่อว่าทุกคนสามารถสร้างธุรกิจที่ประสบความสำเร็จได้
                      หากมีความรู้และเครื่องมือที่ถูกต้อง
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews & Testimonials Section */}
      {reviews.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              รีวิวจากผู้เรียน
            </h2>
            <div className="text-center mb-12">
              <RatingDisplay rating={averageRating} size="lg" />
              <p className="text-gray-600 mt-2">จาก {reviews.length} รีวิว</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={review.user.avatar_url || undefined} />
                        <AvatarFallback>{review.user.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{review.user.full_name}</p>
                        <RatingDisplay rating={review.rating} size="sm" showText={false} />
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{review.comment}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            คำถามที่พบบ่อย
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            พร้อมที่จะเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            เข้าร่วมกับผู้เรียนหลายร้อยคนที่เปลี่ยนชีวิตด้วยคอร์สนี้
          </p>
          
          <div className="max-w-md mx-auto">
            <Card className="p-6">
              <CardContent className="p-0 text-gray-900">
                {!isFree && (
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-blue-600">
                      ฿{course.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">ครั้งเดียว เรียนได้ตลอดชีวิต</div>
                  </div>
                )}
                
                {renderActionButton()}
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                  <Shield className="h-4 w-4" />
                  <span>รับประกันความพึงพอใจ 30 วัน</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseSalesPage;