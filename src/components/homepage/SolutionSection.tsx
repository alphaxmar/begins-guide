import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Target, Calculator, Lightbulb } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              ทุกการเดินทางที่ยิ่งใหญ่<br />
              เริ่มต้นจาก 'พิมพ์เขียว' ที่ถูกต้อง
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ก่อนที่จะลงมือทำอะไร สิ่งแรกที่คุณต้องทำคือ การออกแบบ<br />
              และนั่นคือสิ่งที่ Interactive Dreamlining Tool จะช่วยคุณได้
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Dreamlining Tool จะช่วยคุณ:
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">แปลงความฝันให้เป็นเป้าหมายที่วัดผลได้</h4>
                    <p className="text-muted-foreground">เปลี่ยนจาก "อยากรวย" เป็น "ต้องการรายได้ X บาทต่อเดือน"</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Target className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">คำนวณ Target Monthly Income (TMI)</h4>
                    <p className="text-muted-foreground">รู้ว่าคุณต้องหารายได้เท่าไหร่เพื่อให้ได้ชีวิตที่ต้องการ</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calculator className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">จัดลำดับความสำคัญของความฝัน</h4>
                    <p className="text-muted-foreground">แยกแยะระหว่าง "Having" "Being" และ "Doing" goals</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">สร้างแรงบันดาลใจที่ยั่งยืน</h4>
                    <p className="text-muted-foreground">มี "Freedom Number" ที่ชัดเจนเป็นเป้าหมาย</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/dreamline">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 text-lg">
                    ทดลองใช้ Dreamlining Tool (ฟรี)
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:order-first">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calculator className="h-10 w-10 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Interactive Dreamlining Tool</h4>
                    <p className="text-sm text-muted-foreground">ออกแบบชีวิตในฝันและคำนวณ TMI ของคุณ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;