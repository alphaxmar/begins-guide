import { Tables } from "@/integrations/supabase/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, FileText, MessageCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface AcademyTabsProps {
  lesson: Tables<'lessons'> | null;
  productId: string;
}

const AcademyTabs = ({ lesson, productId }: AcademyTabsProps) => {
  const [comment, setComment] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    
    // TODO: Implement comment submission to database
    console.log("Submitting comment:", comment);
    setComment("");
  };

  const toggleComplete = () => {
    setIsCompleted(!isCompleted);
    // TODO: Implement progress tracking in database
  };

  if (!lesson) {
    return (
      <div className="p-6">
        <div className="text-center text-slate-400">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>เลือกบทเรียนเพื่อดูรายละเอียด</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Lesson Progress */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {lesson.title}
        </h3>
        <Button
          onClick={toggleComplete}
          variant={isCompleted ? "default" : "outline"}
          className={isCompleted 
            ? "bg-green-600 hover:bg-green-700 text-white" 
            : "border-slate-600 text-slate-300 hover:bg-slate-800"
          }
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {isCompleted ? "เรียนจบแล้ว" : "ทำเครื่องหมายเรียนจบ"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
          <TabsTrigger 
            value="description" 
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-slate-300"
          >
            <FileText className="mr-2 h-4 w-4" />
            คำอธิบายบทเรียน
          </TabsTrigger>
          <TabsTrigger 
            value="downloads"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-slate-300"
          >
            <Download className="mr-2 h-4 w-4" />
            ไฟล์ดาวน์โหลด
          </TabsTrigger>
          <TabsTrigger 
            value="qa"
            className="data-[state=active]:bg-amber-500 data-[state=active]:text-black text-slate-300"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            ถาม-ตอบ
          </TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description" className="mt-6">
          <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
            <h4 className="font-semibold text-white mb-4">รายละเอียดบทเรียน</h4>
            {lesson.content ? (
              <div className="prose prose-invert max-w-none">
                <div 
                  className="text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </div>
            ) : (
              <p className="text-slate-400 italic">
                ไม่มีคำอธิบายเพิ่มเติมสำหรับบทเรียนนี้
              </p>
            )}
            
            {/* Learning Objectives */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <h5 className="font-medium text-amber-400 mb-2">วัตถุประสงค์การเรียนรู้</h5>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• เข้าใจแนวคิดหลักของบทเรียนนี้</li>
                <li>• สามารถนำไปประยุกต์ใช้ในการสร้างธุรกิจได้</li>
                <li>• มีความรู้พื้นฐานสำหรับบทเรียนถัดไป</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Downloads Tab */}
        <TabsContent value="downloads" className="mt-6">
          <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
            <h4 className="font-semibold text-white mb-4">เอกสารประกอบการเรียน</h4>
            
            <div className="space-y-3">
              {/* Example downloadable files */}
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Worksheet - {lesson.title}</p>
                    <p className="text-xs text-slate-400">PDF • 2.3 MB</p>
                  </div>
                </div>
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
                  <Download className="mr-2 h-4 w-4" />
                  ดาวน์โหลด
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Template - Action Plan</p>
                    <p className="text-xs text-slate-400">Excel • 1.1 MB</p>
                  </div>
                </div>
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
                  <Download className="mr-2 h-4 w-4" />
                  ดาวน์โหลด
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Checklist - Implementation Guide</p>
                    <p className="text-xs text-slate-400">PDF • 856 KB</p>
                  </div>
                </div>
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
                  <Download className="mr-2 h-4 w-4" />
                  ดาวน์โหลด
                </Button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-400">
                💡 <strong>เคล็ดลับ:</strong> ดาวน์โหลดและใช้เอกสารเหล่านี้ควบคู่กับการดูวิดีโอ 
                เพื่อผลลัพธ์การเรียนรู้ที่ดีที่สุด
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Q&A Tab */}
        <TabsContent value="qa" className="mt-6">
          <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
            <h4 className="font-semibold text-white mb-4">ถาม-ตอบเกี่ยวกับบทเรียนนี้</h4>
            
            {/* Comment Form */}
            <div className="mb-6">
              <Textarea
                placeholder="ถามคำถามเกี่ยวกับบทเรียนนี้..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
              />
              <div className="flex justify-end mt-3">
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!comment.trim()}
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  ส่งคำถาม
                </Button>
              </div>
            </div>

            {/* Example Q&A */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    Q
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">ผู้เรียน A</p>
                    <p className="text-slate-300 text-sm mb-2">
                      สำหรับธุรกิจขนาดเล็ก เครื่องมือ AI ไหนที่แนะนำให้เริ่มต้นก่อนครับ?
                    </p>
                    <p className="text-xs text-slate-500">2 วันที่แล้ว</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 ml-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black text-sm font-bold">
                    A
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-400 font-medium mb-1">ผู้สอน</p>
                    <p className="text-slate-300 text-sm mb-2">
                      สำหรับเริ่มต้น ผมแนะนำให้เริ่มจาก ChatGPT และ Canva ก่อนครับ 
                      เพราะใช้ง่ายและมีผลกระทบต่อประสิทธิภาพทันที
                    </p>
                    <p className="text-xs text-slate-500">1 วันที่แล้ว</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-400">
                🤝 <strong>ชุมชนการเรียนรู้:</strong> อย่าลืมว่าคำถามของคุณอาจช่วยเพื่อนๆ คนอื่น ๆ ได้ด้วย 
                อย่าลังเลที่จะถามเมื่อมีข้อสงสัย!
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademyTabs;