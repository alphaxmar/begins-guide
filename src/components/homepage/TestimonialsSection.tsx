
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import RatingDisplay from "@/components/reviews/RatingDisplay";

type Review = Tables<'course_reviews'> & {
  products?: {
    title: string;
  };
  profiles?: {
    full_name: string;
  };
};

const fetchTopReviews = async () => {
  const { data, error } = await supabase
    .from("course_reviews")
    .select(`
      *,
      products(title)
    `)
    .not("comment", "is", null)
    .gte("rating", 4)
    .order("rating", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw new Error(error.message);
  return data as Review[];
};

const TestimonialsSection = () => {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["homepage-testimonials"],
    queryFn: fetchTopReviews,
  });

  return (
    <section className="mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">เสียงตอบรับจากนักเรียนของเรา</h2>
          <p className="text-xl text-gray-600">พวกเขาทำได้ คุณก็ทำได้เหมือนกัน</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews && reviews.length > 0 ? (
            reviews.map((review, index) => {
              const userName = `ผู้ใช้งาน ${index + 1}`;
              const courseName = review.products?.title || "คอร์สเรียน";
              const firstLetter = userName.charAt(0);
              
              const gradients = [
                "from-blue-400 to-purple-500",
                "from-green-400 to-blue-500", 
                "from-purple-400 to-pink-500"
              ];
              
              return (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="mb-4">
                      <RatingDisplay 
                        rating={review.rating} 
                        size="md" 
                        showText={false}
                      />
                    </div>
                    <p className="text-gray-700 mb-6 italic line-clamp-4">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${gradients[index % 3]} rounded-full flex items-center justify-center text-white font-bold mr-4`}>
                        {firstLetter}
                      </div>
                      <div>
                        <p className="font-bold">{userName}</p>
                        <p className="text-gray-500 text-sm">คอร์ส: {courseName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            // Fallback testimonials
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-4">
                    <RatingDisplay rating={5} size="md" showText={false} />
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "Begins.guide ช่วยให้ผมเริ่มต้นธุรกิจออนไลน์ได้สำเร็จ ตอนนี้มีรายได้เดือนละ 50,000 บาท"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      ส
                    </div>
                    <div>
                      <p className="font-bold">คุณสมชาย ใจดี</p>
                      <p className="text-gray-500 text-sm">ผู้ก่อตั้ง Online Shop</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-4">
                    <RatingDisplay rating={5} size="md" showText={false} />
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "เครื่องมือ AI ช่วยให้ผมประหยัดเวลาไปมากมาย สามารถมีธุรกิจควบคู่กับงานประจำได้"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      ก
                    </div>
                    <div>
                      <p className="font-bold">คุณกิตติ ทำดี</p>
                      <p className="text-gray-500 text-sm">Freelancer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-4">
                    <RatingDisplay rating={5} size="md" showText={false} />
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "จากที่ไม่รู้จะเริ่มยังไง ตอนนี้มีธุรกิจครบ 6 เดือนแล้ว ขอบคุณ Begins.guide มากครับ"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      น
                    </div>
                    <div>
                      <p className="font-bold">น้องนุช สร้างฝัน</p>
                      <p className="text-gray-500 text-sm">นักเรียนปี 4</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
