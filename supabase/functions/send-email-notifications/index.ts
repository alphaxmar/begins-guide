
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, to, data }: EmailRequest = await req.json();

    // สร้าง email template ตาม type
    let subject = '';
    let htmlContent = '';

    switch (type) {
      case 'purchase_confirmation':
        subject = `ยืนยันการสั่งซื้อ - หมายเลขออเดอร์ ${data?.order_id}`;
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h2 style="color: #059669;">ขอบคุณสำหรับการสั่งซื้อ!</h2>
            <p>สวัสดีคุณ ${data?.user_name || 'ลูกค้า'},</p>
            <p>การสั่งซื้อของคุณได้รับการยืนยันแล้ว</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>หมายเลขออเดอร์: ${data?.order_id}</h3>
              <h4>รายการสินค้า:</h4>
              <ul>
                ${data?.products?.map(product => 
                  `<li>${product.title} - ${product.price.toLocaleString()} บาท</li>`
                ).join('') || ''}
              </ul>
              <p><strong>ยอดรวม: ${data?.total_amount?.toLocaleString()} บาท</strong></p>
            </div>
            
            <p>คุณสามารถเข้าถึงสินค้าที่ซื้อได้ที่ <a href="${Deno.env.get('SITE_URL')}/profile">หน้าโปรไฟล์</a></p>
            
            <hr style="margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              ขอบคุณที่ใช้บริการ Begins Guide<br>
              หากมีคำถามกรุณาติดต่อ: support@beginsguide.com
            </p>
          </div>
        `;
        break;

      case 'welcome':
        subject = 'ยินดีต้อนรับสู่ Begins Guide!';
        htmlContent = `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h2 style="color: #059669;">ยินดีต้อนรับสู่ Begins Guide!</h2>
            <p>สวัสดีคุณ ${data?.user_name || 'สมาชิกใหม่'},</p>
            <p>ขอบคุณที่เข้าร่วมกับเรา! เราหวังว่าคุณจะพบกับเนื้อหาและคอร์สที่เป็นประโยชน์</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>เริ่มต้นเส้นทางของคุณ:</h3>
              <ul>
                <li><a href="${Deno.env.get('SITE_URL')}/articles">อ่านบทความฟรี</a></li>
                <li><a href="${Deno.env.get('SITE_URL')}/products">เลือกดูคอร์สและเทมเพลต</a></li>
                <li><a href="${Deno.env.get('SITE_URL')}/profile">จัดการโปรไฟล์</a></li>
              </ul>
            </div>
            
            <hr style="margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              หากมีคำถามกรุณาติดต่อ: support@beginsguide.com
            </p>
          </div>
        `;
        break;

      default:
        throw new Error('Invalid email type');
    }

    // Log การส่งอีเมล (ในระบบจริงจะเชื่อมต่อกับ email service เช่น SendGrid, Mailgun)
    console.log('Email would be sent:', {
      to,
      subject,
      type,
      timestamp: new Date().toISOString()
    });

    // บันทึกลง database เพื่อ tracking
    const { error: logError } = await supabaseClient
      .from('email_logs')
      .insert({
        recipient: to,
        email_type: type,
        subject,
        status: 'sent',
        sent_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Error logging email:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email ${type} queued for sending to ${to}` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
