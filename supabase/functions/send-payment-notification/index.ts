import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface NotificationRequest {
  type: 'slip_uploaded' | 'slip_reviewed';
  orderId?: string;
  slipId?: string;
  amount?: number;
  bankName?: string;
  transactionDate?: string;
  status?: string;
  adminNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, orderId, slipId, amount, bankName, transactionDate, status, adminNotes }: NotificationRequest = await req.json();

    // Create Supabase client with service role for admin operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    if (type === 'slip_uploaded') {
      // Send notification to admin when slip is uploaded
      await resend.emails.send({
        from: "Begins Guide <noreply@begins.guide>",
        to: ["admin@begins.guide"], // Replace with actual admin email
        subject: "🧾 สลิปการโอนเงินใหม่รอการตรวจสอบ",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">สลิปการโอนเงินใหม่</h2>
            <p>มีสลิปการโอนเงินใหม่ที่ต้องตรวจสอบ:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>จำนวนเงิน:</strong> ${amount?.toLocaleString()} บาท</p>
              <p><strong>ธนาคาร:</strong> ${bankName}</p>
              <p><strong>วันที่โอนเงิน:</strong> ${transactionDate}</p>
            </div>
            
            <p>กรุณาเข้าสู่ระบบจัดการเพื่อตรวจสอบสลิปการโอนเงิน</p>
            
            <a href="https://dbad61e2-24f5-4037-a08a-87d92111db2c.lovableproject.com/admin/payment-slips" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              ตรวจสอบสลิป
            </a>
          </div>
        `,
      });

    } else if (type === 'slip_reviewed') {
      // Send notification to user when slip is reviewed
      if (!slipId) throw new Error('Slip ID is required for slip_reviewed type');

      // Get slip and user details
      const { data: slip, error } = await supabase
        .from('payment_slips')
        .select(`
          *,
          orders!inner (
            user_id,
            profiles!inner (
              full_name
            )
          )
        `)
        .eq('id', slipId)
        .single();

      if (error) throw error;

      // Get user email from auth
      const { data: user } = await supabase.auth.admin.getUserById(slip.orders.user_id);
      if (!user.user?.email) throw new Error('User email not found');

      const isApproved = status === 'approved';
      const statusText = isApproved ? 'อนุมัติแล้ว' : 'ปฏิเสธ';
      const statusColor = isApproved ? '#10b981' : '#ef4444';

      await resend.emails.send({
        from: "Begins Guide <noreply@begins.guide>",
        to: [user.user.email],
        subject: `🧾 สลิปการโอนเงินของคุณ${statusText}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">ผลการตรวจสอบสลิปการโอนเงิน</h2>
            <p>สวัสดี ${slip.orders.profiles.full_name},</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>สถานะ:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
              <p><strong>จำนวนเงิน:</strong> ${slip.amount.toLocaleString()} บาท</p>
              <p><strong>ธนาคาร:</strong> ${slip.bank_name}</p>
              ${adminNotes ? `<p><strong>หมายเหตุ:</strong> ${adminNotes}</p>` : ''}
            </div>
            
            ${isApproved ? `
              <p style="color: #10b981; font-weight: bold;">✅ การชำระเงินของคุณสำเร็จแล้ว!</p>
              <p>คุณสามารถเข้าใช้งานผลิตภัณฑ์ที่สั่งซื้อได้ทันที</p>
              <a href="https://dbad61e2-24f5-4037-a08a-87d92111db2c.lovableproject.com/profile" 
                 style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
                ดูผลิตภัณฑ์ของฉัน
              </a>
            ` : `
              <p style="color: #ef4444; font-weight: bold;">❌ สลิปการโอนเงินไม่ผ่านการตรวจสอบ</p>
              <p>หากคุณมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อเรา</p>
            `}
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              หากคุณมีคำถามเพิ่มเติม กรุณาติดต่อเราที่ support@begins.guide
            </p>
          </div>
        `,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-payment-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);