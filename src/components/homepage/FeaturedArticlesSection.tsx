
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";

const fetchPinnedArticles = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("is_pinned_on_hub", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw new Error(error.message);
  return data;
};

const FeaturedArticlesSection = () => {
  const { data: pinnedArticles, isLoading } = useQuery<Tables<'articles'>[]>({
    queryKey: ["homepage-pinned-articles"],
    queryFn: fetchPinnedArticles,
  });

  return (
    <section className="mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">บทความ​แนะนำ</h2>
          <p className="text-xl text-gray-600">เนื้อหาคุณภาพสูงที่จะช่วยให้คุณเริ่มต้นได้ทันที</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <Skeleton className="aspect-video rounded-t-lg" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-20 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pinnedArticles && pinnedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pinnedArticles.map((article) => (
              <Card key={article.slug} className="hover:shadow-lg transition-shadow">
                <Link to={`/articles/${article.slug}`}>
                  <div 
                    className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg bg-cover bg-center"
                    style={{ 
                      backgroundImage: article.cover_image_url 
                        ? `url(${article.cover_image_url})` 
                        : undefined 
                    }}
                  />
                </Link>
                <CardContent className="p-6">
                  <Badge className="mb-3">{article.category || "บทความ"}</Badge>
                  <Link to={`/articles/${article.slug}`}>
                    <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {article.excerpt || "อ่านบทความเต็มเพื่อดูรายละเอียด..."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"></div>
              <CardContent className="p-6">
                <Badge className="mb-3">เริ่มต้น</Badge>
                <h3 className="font-bold text-lg mb-2">10 ไอเดียธุรกิจที่ทำได้จริงในปี 2025</h3>
                <p className="text-gray-600 text-sm">ไอเดียธุรกิจที่ไม่ต้องลงทุนเยอะ แต่มีโอกาสทำเงินสูง...</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-r from-green-400 to-blue-500 rounded-t-lg"></div>
              <CardContent className="p-6">
                <Badge className="mb-3">การตลาด</Badge>
                <h3 className="font-bold text-lg mb-2">วิธีหาลูกค้าคนแรกในวันที่ 1</h3>
                <p className="text-gray-600 text-sm">เทคนิคการหาลูกค้าที่ใช้ได้ผลจริง แม้จะเป็นธุรกิจใหม่...</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-r from-purple-400 to-pink-500 rounded-t-lg"></div>
              <CardContent className="p-6">
                <Badge className="mb-3">เครื่องมือ</Badge>
                <h3 className="font-bold text-lg mb-2">เครื่องมือฟรีที่ทุกสตาร์ทอัปต้องมี</h3>
                <p className="text-gray-600 text-sm">รวมเครื่องมือฟรีที่จะช่วยให้ธุรกิจของคุณดูมืออาชีพ...</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link to="/articles">
              ดูบทความทั้งหมด
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticlesSection;
