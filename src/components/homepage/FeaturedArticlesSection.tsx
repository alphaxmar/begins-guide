
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedArticlesSection = () => {
  return (
    <section className="mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">บทความแนะนำ</h2>
          <p className="text-xl text-gray-600">เนื้อหาคุณภาพสูงที่จะช่วยให้คุณเริ่มต้นได้ทันที</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"></div>
            <CardContent className="p-6">
              <Badge className="mb-3">เริ่มต้น</Badge>
              <h3 className="font-bold text-lg mb-2">10 ไอเดียธุรกิจที่ทำได้จริงในปี 2024</h3>
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
        
        <div className="text-center mt-8">
          <Link to="/articles">
            <Button variant="outline" size="lg">
              ดูบทความทั้งหมด
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticlesSection;
