import React from 'react';
import { Clock, MapPin, Battery } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
            คุณเคยรู้สึกแบบนี้บ้างไหม?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">รู้สึกว่าเวลาหายไป</h3>
              <p className="text-muted-foreground">
                วันต่อวันผ่านไปโดยไม่รู้ตัว แต่ยังไม่เห็นความก้าวหน้าที่ชัดเจน
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">ขาดทิศทางที่ชัดเจน</h3>
              <p className="text-muted-foreground">
                มีเป้าหมายคลุมเครือ ไม่รู้ว่าควรเริ่มต้นจากตรงไหน
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <Battery className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">หมดไฟ</h3>
              <p className="text-muted-foreground">
                เหนื่อยจากการทำงานที่ไม่ได้นำไปสู่ความฝันที่แท้จริง
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;