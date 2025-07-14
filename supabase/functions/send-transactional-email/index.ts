import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'welcome' | 'certificate' | 'follow_up';
  to: string;
  data: {
    user_name?: string;
    course_title?: string;
    course_slug?: string;
    certificate_number?: string;
    certificate_url?: string;
  };
}

const getEmailTemplate = (type: string, data: any): { subject: string; html: string } => {
  const baseUrl = "https://dbad61e2-24f5-4037-a08a-87d92111db2c.lovableproject.com";
  
  switch (type) {
    case 'welcome':
      return {
        subject: `🎉 ยินดีต้อนรับสู่คอร์ส ${data.course_title}!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ยินดีต้อนรับสู่ Begins.guide</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header -->
            <div style="text-align: center; border-bottom: 3px solid #8B5CF6; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Begins.guide</h1>
              <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">เส้นทางสู่ความสำเร็จทางธุรกิจ</p>
            </div>

            <!-- Main Content -->
            <div style="background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px;">
              <h2 style="color: #1E293B; margin-top: 0; font-size: 24px;">🎉 ยินดีต้อนรับ ${data.user_name || 'คุณ'}!</h2>
              
              <p style="font-size: 16px; color: #475569; margin-bottom: 20px;">
                ขอบคุณที่ลงทะเบียนเรียนคอร์ส <strong>"${data.course_title}"</strong> กับเรา 
                คุณได้ก้าวแรกสำคัญสู่การสร้างธุรกิจที่ประสบความสำเร็จแล้ว!
              </p>

              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; margin: 20px 0;">
                <h3 style="color: #059669; margin-top: 0; font-size: 18px;">🚀 สิ่งที่คุณจะได้รับ:</h3>
                <ul style="color: #374151; padding-left: 20px;">
                  <li>เข้าถึงบทเรียนทั้งหมดตลอด 24 ชั่วโมง</li>
                  <li>เอกสารประกอบและเทมเพลตสำหรับดาวน์โหลด</li>
                  <li>ใบรับรองหลังเรียนจบ</li>
                  <li>การอัปเดตเนื้อหาใหม่ๆ อย่างต่อเนื่อง</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/learn/${data.course_slug}" 
                   style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 15px 40px; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 18px; 
                          display: inline-block;
                          box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.3);">
                  🎯 เริ่มเรียนเลย!
                </a>
              </div>
            </div>

            <!-- Tips Section -->
            <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; border: 1px solid #F59E0B; margin-bottom: 20px;">
              <h3 style="color: #92400E; margin-top: 0; font-size: 16px;">💡 เคล็ดลับสำหรับการเรียนรู้ที่มีประสิทธิภาพ:</h3>
              <p style="color: #78350F; margin-bottom: 0; font-size: 14px;">
                แนะนำให้เรียนทีละบท และฝึกทำตามในโลกจริง เพื่อให้ได้ผลลัพธ์ที่ดีที่สุด 🎯
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
              <p>หากมีคำถามใดๆ สามารถติดต่อเราได้ที่ support@begins.guide</p>
              <p style="margin: 10px 0 0 0;">
                <a href="${baseUrl}" style="color: #8B5CF6; text-decoration: none;">Begins.guide</a> - 
                พัฒนาธุรกิจของคุณให้ประสบความสำเร็จ
              </p>
            </div>

          </body>
          </html>
        `
      };

    case 'certificate':
      return {
        subject: `🏆 ยินดีด้วย! คุณเรียนจบคอร์ส ${data.course_title} แล้ว`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ยินดีด้วย! เรียนจบแล้ว</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header -->
            <div style="text-align: center; border-bottom: 3px solid #10B981; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="color: #10B981; font-size: 28px; margin: 0;">Begins.guide</h1>
              <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">เส้นทางสู่ความสำเร็จทางธุรกิจ</p>
            </div>

            <!-- Congratulations -->
            <div style="text-align: center; background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); padding: 40px 20px; border-radius: 12px; margin-bottom: 25px;">
              <div style="font-size: 60px; margin-bottom: 20px;">🏆</div>
              <h2 style="color: #065F46; margin: 0 0 15px 0; font-size: 28px;">ยินดีด้วย ${data.user_name || 'คุณ'}!</h2>
              <p style="color: #047857; font-size: 18px; margin: 0; font-weight: 500;">
                คุณได้เรียนจบคอร์ส <strong>"${data.course_title}"</strong> เรียบร้อยแล้ว
              </p>
            </div>

            <!-- Achievement Box -->
            <div style="background: white; padding: 25px; border-radius: 8px; border: 2px solid #10B981; margin-bottom: 25px;">
              <h3 style="color: #059669; margin-top: 0; font-size: 20px; text-align: center;">🎯 คุณได้สำเร็จแล้ว!</h3>
              
              <div style="text-align: center; margin: 20px 0;">
                <p style="color: #374151; font-size: 16px; margin-bottom: 15px;">
                  การเรียนจบคอร์สนี้แสดงให้เห็นถึงความมุ่งมั่นและความพร้อมของคุณในการสร้างธุรกิจที่ประสบความสำเร็จ
                </p>
                
                <div style="background: #F3F4F6; padding: 15px; border-radius: 6px; margin: 15px 0;">
                  <p style="margin: 0; color: #6B7280; font-size: 14px;">เลขที่ใบรับรอง</p>
                  <p style="margin: 5px 0 0 0; color: #1F2937; font-weight: bold; font-family: monospace;">${data.certificate_number}</p>
                </div>
              </div>

              <!-- Download Certificate Button -->
              <div style="text-align: center; margin: 25px 0;">
                <a href="${data.certificate_url || baseUrl + '/certificate/' + data.course_slug}" 
                   style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 15px 30px; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 16px; 
                          display: inline-block;
                          box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.3);">
                  📜 ดาวน์โหลดใบรับรอง
                </a>
              </div>
            </div>

            <!-- Next Steps -->
            <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; border: 1px solid #F59E0B; margin-bottom: 20px;">
              <h3 style="color: #92400E; margin-top: 0; font-size: 18px;">🚀 ขั้นตอนต่อไป:</h3>
              <ul style="color: #78350F; padding-left: 20px; margin-bottom: 0;">
                <li>นำความรู้ที่ได้ไปปรับใช้กับธุรกิจของคุณ</li>
                <li>แชร์ใบรับรองบน LinkedIn หรือ Social Media</li>
                <li>สำรวจคอร์สอื่นๆ ที่น่าสนใจเพื่อต่อยอดความรู้</li>
                <li>เข้าร่วมชุมชนผู้ประกอบการเพื่อแลกเปลี่ยนประสบการณ์</li>
              </ul>
            </div>

            <!-- Social Share -->
            <div style="text-align: center; margin: 25px 0;">
              <p style="color: #6B7280; margin-bottom: 15px;">แชร์ความสำเร็จของคุณ:</p>
              <div style="display: inline-block;">
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.certificate_url || baseUrl + '/certificate/' + data.course_slug)}" 
                   style="background: #0077B5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px; font-size: 14px;">
                  LinkedIn
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.certificate_url || baseUrl + '/certificate/' + data.course_slug)}" 
                   style="background: #1877F2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px; font-size: 14px;">
                  Facebook
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
              <p>ขอบคุณที่เป็นส่วนหนึ่งของ Begins.guide</p>
              <p style="margin: 10px 0 0 0;">
                <a href="${baseUrl}" style="color: #10B981; text-decoration: none;">Begins.guide</a> - 
                เรายินดีที่ได้เป็นส่วนหนึ่งในเส้นทางสู่ความสำเร็จของคุณ
              </p>
            </div>

          </body>
          </html>
        `
      };

    case 'follow_up':
      return {
        subject: `📚 เป็นอย่างไรบ้างครับ กับคอร์ส ${data.course_title}?`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Follow up - Begins.guide</title>
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header -->
            <div style="text-align: center; border-bottom: 3px solid #8B5CF6; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Begins.guide</h1>
              <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">เส้นทางสู่ความสำเร็จทางธุรกิจ</p>
            </div>

            <!-- Main Content -->
            <div style="background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%); padding: 30px; border-radius: 12px; margin-bottom: 25px;">
              <h2 style="color: #1E293B; margin-top: 0; font-size: 24px;">👋 สวัสดี ${data.user_name || 'คุณ'}!</h2>
              
              <p style="font-size: 16px; color: #475569; margin-bottom: 20px;">
                เราหวังว่าคุณจะได้รับประโยชน์จากคอร์ส <strong>"${data.course_title}"</strong> ที่เรียนไปแล้ว
              </p>

              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 20px 0;">
                <h3 style="color: #D97706; margin-top: 0; font-size: 18px;">🤔 ติดปัญหาอะไรไหม?</h3>
                <p style="color: #374151; margin-bottom: 15px;">
                  ถ้าคุณมีคำถามหรือต้องการคำแนะนำเพิ่มเติม เรายินดีที่จะช่วยเหลือ!
                </p>
                <ul style="color: #374151; padding-left: 20px; margin-bottom: 0;">
                  <li>ติดปัญหาเทคนิคในการเรียน?</li>
                  <li>ต้องการคำแนะนำเพิ่มเติม?</li>
                  <li>อยากรู้เทคนิคขั้นสูง?</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/learn/${data.course_slug}" 
                   style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 15px 40px; 
                          border-radius: 8px; 
                          font-weight: bold; 
                          font-size: 18px; 
                          display: inline-block;
                          box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.3);">
                  📖 กลับไปเรียนต่อ
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
              <p>หากมีคำถามใดๆ สามารถติดต่อเราได้ที่ support@begins.guide</p>
              <p style="margin: 10px 0 0 0;">
                <a href="${baseUrl}" style="color: #8B5CF6; text-decoration: none;">Begins.guide</a> - 
                เราอยู่ที่นี่เพื่อสนับสนุนการเรียนรู้ของคุณ
              </p>
            </div>

          </body>
          </html>
        `
      };

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    console.log("Email request received:", emailRequest);

    const { subject, html } = getEmailTemplate(emailRequest.type, emailRequest.data);

    const emailResponse = await resend.emails.send({
      from: "Begins.guide <noreply@begins.guide>",
      to: [emailRequest.to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: emailResponse.data?.id,
        message: "Email sent successfully"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-transactional-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);