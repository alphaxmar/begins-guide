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
  Crown,
  CheckCircle,
  Clock,
  Users,
  PlayCircle,
  Download,
  ArrowLeft,
  Star,
  Trophy,
  Zap,
  BookOpen,
  Sparkles,
  ShoppingCart,
  Heart,
  TrendingUp,
  Shield,
  Target,
  Gift,
  Loader2,
  Award,
  MessageSquare,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PaymentOptions from "@/components/payment/PaymentOptions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        <Header />
        <main className="flex-1">
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
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบคอร์สที่คุณค้นหา</h1>
            <p className="text-gray-600 mb-8">คอร์สนี้อาจถูกลบหรือย้ายไปแล้ว</p>
            <Button asChild>
              <Link to="/articles">กลับไปหน้าหลัก</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isFree = course.price === 0;
  const totalLessons = lessons.length;
  const estimatedHours = Math.ceil(totalLessons * 0.5); // ประมาณ 30 นาทีต่อบทเรียน

  // Mock data สำหรับ demo
  const benefits = [
    "เรียนรู้ได้ทุกที่ทุกเวลา ไม่มีข้อจำกัด",
    "ได้ใบรับรองหลังจบคอร์ส",
    "เข้าถึงเนื้อหาได้ตลอดชีวิต",
    "มีไฟล์เสริมและเทมเพลตให้ดาวน์โหลด",
    "Q&A กับผู้สอนและเพื่อนร่วมคอร์ส",
    "อัปเดตเนื้อหาใหม่ฟรี"
  ];

  const testimonials = [
    {
      name: "นาย ธนกร ใจดี",
      role: "Startup Founder",
      content: "คอร์สนี้ช่วยให้ผมเข้าใจการทำธุรกิจมากขึ้น และสามารถนำไปปรับใช้กับบริษัทได้จริง",
      rating: 5,
      image: "/placeholder.svg"
    },
    {
      name: "คุณ สมใจ ประสบผล",
      role: "E-commerce Owner", 
      content: "เนื้อหาครบครัน เข้าใจง่าย และที่สำคัญคือใช้ได้จริง ขอบคุณมากครับ",
      rating: 5,
      image: "/placeholder.svg"
    },
    {
      name: "นางสาว ปิยดา สำเร็จ",
      role: "Digital Marketer",
      content: "คอร์สที่ดีที่สุดที่เคยเรียน คุ้มค่ากับเงินที่จ่ายไป และได้ความรู้เยอะมาก",
      rating: 5,
      image: "/placeholder.svg"
    }
  ];

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
      answer: "มีครับ สามารถถามคำถามได้ในกลุ่มเฟซบุ๊กของคอร์ส และทีมงานจะช่วยตอบข้อสงสัย"
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
    navigate(`/learn/${course.slug}`);
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

    if (accessType === 'vip') {
      return (
        <div className="space-y-4">
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800">
              คอร์สนี้รวมอยู่ใน <strong>Begins.guide PRO</strong>
            </p>
          </div>
          <Button asChild size="lg" className="w-full bg-yellow-600 hover:bg-yellow-700">
            <Link to="/pricing">
              <Crown className="mr-2 h-5 w-5" />
              อัปเกรดเป็น PRO
            </Link>
          </Button>
        </div>
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับ
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Course Info */}
            <div className="space-y-6">
              {/* Course Image */}
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
                  <span>500+ คนเรียนแล้ว</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.9/5 คะแนน</span>
                </div>
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
                    {benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              ทำไมต้องเลือกคอร์สนี้?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">เนื้อหาล่าสุด</h3>
                <p className="text-gray-600">
                  เนื้อหาที่อัปเดตใหม่ล่าสุด ตามเทรนด์ธุรกิจ 2025
                </p>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">ผู้สอนผู้เชี่ยวชาญ</h3>
                <p className="text-gray-600">
                  เรียนจากผู้เชี่ยวชาญที่มีประสบการณ์จริงในการทำธุรกิจ
                </p>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">ใช้ได้จริง</h3>
                <p className="text-gray-600">
                  เน้นความรู้ที่นำไปใช้ได้จริง พร้อมตัวอย่างและกรณีศึกษา
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Course Curriculum */}
        {lessons.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                เนื้อหาในคอร์ส
              </h2>
              
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      หลักสูตร ({totalLessons} บทเรียน)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {lessons.map((lesson, index) => (
                        <AccordionItem key={lesson.id} value={`lesson-${index}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </div>
                              <span>{lesson.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-11 space-y-2">
                              {lesson.content && (
                                <p className="text-gray-600 text-sm">
                                  {lesson.content.length > 150 
                                    ? `${lesson.content.substring(0, 150)}...` 
                                    : lesson.content}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {lesson.video_url && (
                                  <div className="flex items-center gap-1">
                                    <PlayCircle className="h-4 w-4" />
                                    <span>วิดีโอ</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>30 นาที</span>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              ความคิดเห็นจากผู้เรียน
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 italic">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.image} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              คำถามที่พบบ่อย
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <AccordionItem value={`faq-${index}`} className="border-none">
                      <AccordionTrigger className="px-6 py-4 text-left font-semibold">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              พร้อมเริ่มต้นเส้นทางการเรียนรู้แล้วหรือยัง?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              เข้าร่วมกับผู้เรียนมากกว่า 500 คนที่เชื่อมั่นในคุณภาพของเรา
            </p>
            
            <div className="max-w-md mx-auto">
              {renderActionButton()}
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>รับประกันความพึงพอใจ</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>ได้ใบรับรอง</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>เรียนได้ตลอดชีวิต</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseSalesPage;