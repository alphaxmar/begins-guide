
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailNotificationData {
  type: 'purchase_confirmation' | 'welcome' | 'password_reset';
  to: string;
  data?: {
    user_name?: string;
    order_id?: string;
    products?: Array<{ title: string; price: number }>;
    total_amount?: number;
    reset_link?: string;
  };
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const getEmailTemplate = (type: string, data: any) => {
  const baseStyle = `
    <div style="font-family: Sarabun, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; line-height: 1.6;">
  `;
  
  const headerStyle = `
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px;">
      <h1 style="color: #2563eb; font-size: 28px; font-weight: bold; margin: 0 0 10px 0;">Begins Guide</h1>
  `;
  
  const footerStyle = `
    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; font-size: 14px; color: #9ca3af; margin-top: 30px;">
      <p>ขอบคุณที่เป็นส่วนหนึ่งของ Begins Guide</p>
      <p>หากมีคำถาม สามารถติดต่อเราได้ที่ support@beginsguide.com</p>
    </div>
    </div>
  `;

  switch (type) {
    case 'welcome':
      return `
        ${baseStyle}
        ${headerStyle}
        <p style="color: #64748b; font-size: 16px; margin: 0;">ยินดีต้อนรับสู่ชุมชนผู้เริ่มต้นธุรกิจ</p>
        </div>
        <div style="margin-bottom: 30px; font-size: 16px; color: #374151;">
          <p>สวัสดีครับ ${data?.user_name || 'สมาชิกใหม่'},</p>
          <p>ยินดีต้อนรับเข้าสู่ <strong>Begins Guide</strong> - แพลตฟอร์มที่จะช่วยให้คุณเริ่มต้นธุรกิจของตัวเองได้สำเร็จ!</p>
          
          <h3 style="color: #2563eb; margin-top: 25px;">สิ่งที่คุณจะได้รับ:</h3>
          <ul style="margin: 15px 0; padding-left: 20px;">
            <li>📚 บทความความรู้เชิงลึกเกี่ยวกับการทำธุรกิจ</li>
            <li>🎯 คอร์สออนไลน์คุณภาพสูงจากผู้เชี่ยวชาญ</li>
            <li>📋 เทมเพลตทางธุรกิจที่ใช้งานได้จริง</li>
            <li>💡 ไอเดียและแรงบันดาลใจสำหรับการเริ่มต้น</li>
          </ul>
          
          <p>เริ่มต้นได้เลยวันนี้ด้วยการสำรวจบทความฟรีและหาคอร์สที่เหมาะกับคุณ!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SITE_URL') || 'https://beginsguide.com'}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              เริ่มต้นเลย
            </a>
          </div>
        </div>
        ${footerStyle}
      `;
      
    case 'purchase_confirmation':
      const products = data?.products || [];
      const productList = products.map((p: any) => 
        `<li style="margin: 8px 0;">${p.title} - ${p.price.toLocaleString()} บาท</li>`
      ).join('');
      
      return `
        ${baseStyle}
        ${headerStyle}
        <p style="color: #64748b; font-size: 16px; margin: 0;">ยืนยันการสั่งซื้อ</p>
        </div>
        <div style="margin-bottom: 30px; font-size: 16px; color: #374151;">
          <p>สวัสดีครับ ${data?.user_name || 'ลูกค้า'},</p>
          <p>ขอบคุณสำหรับการสั่งซื้อ! เราได้รับการชำระเงินของคุณเรียบร้อยแล้ว</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2563eb; margin-top: 0;">รายละเอียดคำสั่งซื้อ #${data?.order_id}</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
              ${productList}
            </ul>
            <p style="font-weight: bold; font-size: 18px; color: #059669; margin: 15px 0 0 0;">
              ยอดรวม: ${data?.total_amount?.toLocaleString()} บาท
            </p>
          </div>
          
          <p>คุณสามารถเข้าถึงสินค้าที่ซื้อได้แล้วในหน้าโปรไฟล์ของคุณ</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SITE_URL') || 'https://beginsguide.com'}/profile" 
               style="background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              ดูสินค้าของฉัน
            </a>
          </div>
        </div>
        ${footerStyle}
      `;
      
    case 'password_reset':
      return `
        ${baseStyle}
        ${headerStyle}
        <p style="color: #64748b; font-size: 16px; margin: 0;">รีเซ็ตรหัสผ่าน</p>
        </div>
        <div style="margin-bottom: 30px; font-size: 16px; color: #374151;">
          <p>สวัสดีครับ ${data?.user_name || 'ผู้ใช้'},</p>
          <p>เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data?.reset_link}" 
               style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              รีเซ็ตรหัสผ่าน
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">
            หากคุณไม่ได้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลนี้
          </p>
        </div>
        ${footerStyle}
      `;
      
    default:
      return `${baseStyle}<p>Invalid email type</p></div>`;
  }
};

const getEmailSubject = (type: string) => {
  switch (type) {
    case 'welcome':
      return '🎉 ยินดีต้อนรับสู่ Begins Guide!';
    case 'purchase_confirmation':
      return '✅ ยืนยันการสั่งซื้อ - Begins Guide';
    case 'password_reset':
      return '🔒 รีเซ็ตรหัสผ่าน - Begins Guide';
    default:
      return 'Begins Guide Notification';
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: EmailNotificationData = await req.json();
    
    const html = getEmailTemplate(emailData.type, emailData.data);
    const subject = getEmailSubject(emailData.type);

    const { data, error } = await resend.emails.send({
      from: "Begins Guide <noreply@resend.dev>",
      to: [emailData.to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ 
      success: true, 
      data: data 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Email notification error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
