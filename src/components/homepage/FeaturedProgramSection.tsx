
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";

const FeaturedProgramSection = () => {
  return (
    <section className="mb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">โปรแกรมแนะนำ</h2>
          <p className="text-xl text-gray-600">ผลิตภัณฑ์เด่นที่จะช่วยเปลี่ยนชีวิตคุณ</p>
        </div>
        
        <Card className="overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-6">
              <Badge className="bg-blue-500 text-white">โปรแกรมเรือธง</Badge>
              <h3 className="text-3xl font-bold text-gray-900">
                Zero to Launch Blueprint
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed">
                โปรแกรมโค้ชชิ่ง 90 วัน ที่จะพาคุณจากการมีแค่ไอเดีย ไปสู่การมีธุรกิจที่ทำเงินได้จริง
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Live Group Coaching ทุกสัปดาห์</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>ชุมชนส่วนตัวสำหรับผู้เรียน</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>เทมเพลตและเครื่องมือพิเศษ</span>
                </div>
              </div>
              
              <Link to="/program">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  ดูรายละเอียดโปรแกรม
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Play className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FeaturedProgramSection;
