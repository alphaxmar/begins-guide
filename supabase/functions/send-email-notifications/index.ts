
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data } = await req.json();
    
    // ตัวอย่างการส่งอีเมลผ่าน Resend (คุณต้องเพิ่ม RESEND_API_KEY ใน secrets)
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not found, logging email instead");
      console.log(`Email Type: ${type}`);
      console.log(`To: ${to}`);
      console.log(`Data:`, data);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "Email logged (API key not configured)" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "welcome":
        subject = "ยินดีต้อนรับสู่ Begins Guide!";
        htmlContent = `
          <h1>ยินดีต้อนรับ ${data.user_name || 'คุณ'}!</h1>
          <p>ขอบคุณที่เข้าร่วมกับ Begins Guide ชุมชนสำหรับผู้ที่ต้องการเริ่มต้นธุรกิจ</p>
          <p>เราหวังว่าคุณจะได้รับความรู้และประสบการณ์ที่มีค่าจากเรา</p>
        `;
        break;
        
      case "purchase_confirmation":
        subject = "ยืนยันการสั่งซื้อ - Begins Guide";
        htmlContent = `
          <h1>ยืนยันการสั่งซื้อ</h1>
          <p>เรียน ${data.user_name || 'คุณลูกค้า'},</p>
          <p>ขอบคุณสำหรับการสั่งซื้อสินค้าจาก Begins Guide</p>
          <p><strong>หมายเลขออเดอร์:</strong> ${data.order_id}</p>
          <p><strong>ยอดรวม:</strong> ${data.total_amount?.toLocaleString()} บาท</p>
          <h3>รายการสินค้า:</h3>
          ${data.products?.map((product: any) => `
            <p>- ${product.title} (${product.price?.toLocaleString()} บาท)</p>
          `).join('') || ''}
          <p>คุณสามารถเข้าถึงสินค้าที่ซื้อได้ใน<a href="${Deno.env.get("SITE_URL")}/profile">หน้าโปรไฟล์</a>ของคุณ</p>
        `;
        break;
        
      default:
        throw new Error("Unknown email type");
    }

    const emailData = {
      from: "Begins Guide <noreply@beginsguide.com>",
      to: [to],
      subject,
      html: htmlContent,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    const result = await response.json();
    
    return new Response(JSON.stringify({ 
      success: true, 
      messageId: result.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
