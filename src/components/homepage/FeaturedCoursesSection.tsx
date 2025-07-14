import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import RatingDisplay from "@/components/reviews/RatingDisplay";

type Course = Tables<'products'> & {
  course_reviews: Array<{
    rating: number;
  }>;
  lessons: Array<{
    id: string;
  }>;
};

const fetchFeaturedCourses = async () => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      course_reviews(rating),
      lessons(id)
    `)
    .eq("product_type", "course")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) throw new Error(error.message);
  return data as Course[];
};

const calculateAverageRating = (reviews: Array<{ rating: number }>) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(price);
};

const FeaturedCoursesSection = () => {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["homepage-featured-courses"],
    queryFn: fetchFeaturedCourses,
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">คอร์สเรียนแนะนำ</h2>
            <p className="text-xl text-gray-600">คอร์สคุณภาพสูงที่จะเปลี่ยนชีวิตการทำงานของคุณ</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <Skeleton className="aspect-video rounded-t-lg" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-20 mb-3" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => {
                const averageRating = calculateAverageRating(course.course_reviews);
                const reviewCount = course.course_reviews?.length || 0;
                const lessonCount = course.lessons?.length || 0;
                
                return (
                  <Card key={course.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <Link to={`/products/${course.slug}`}>
                      <div 
                        className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg bg-cover bg-center relative"
                        style={{ 
                          backgroundImage: course.image_url 
                            ? `url(${course.image_url})` 
                            : undefined 
                        }}
                      >
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-black">
                            คอร์สเรียน
                          </Badge>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-6">
                      <Link to={`/products/${course.slug}`}>
                        <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {course.description || "คอร์สเรียนคุณภาพสูงที่จะช่วยพัฒนาทักษะของคุณ"}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{lessonCount} บทเรียน</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{reviewCount} รีวิว</span>
                        </div>
                      </div>
                      
                      {reviewCount > 0 && (
                        <div className="mb-4">
                          <RatingDisplay 
                            rating={averageRating} 
                            size="sm" 
                            showText={true}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(course.price)}
                        </div>
                      </div>
                      
                      <Button asChild className="w-full">
                        <Link to={`/products/${course.slug}`}>
                          ดูรายละเอียด
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <Badge className="mb-3">คอร์สเรียน</Badge>
                  <h3 className="font-bold text-lg mb-2">เริ่มต้นธุรกิจออนไลน์</h3>
                  <p className="text-gray-600 text-sm mb-4">เรียนรู้การสร้างธุรกิจออนไลน์ตั้งแต่เริ่มต้น</p>
                  <div className="text-2xl font-bold text-primary mb-4">฿2,990</div>
                  <Button className="w-full">ดูรายละเอียด</Button>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">
                ดูคอร์สทั้งหมด
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;