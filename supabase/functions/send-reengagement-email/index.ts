import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReengagementEmailData {
  type: 'manual' | 'scheduled';
  user_id?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { type, user_id }: ReengagementEmailData = await req.json();

    let usersToEmail: any[] = [];

    if (type === 'manual' && user_id) {
      // Send to specific user
      const { data: user, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', user_id)
        .single();

      if (error) throw error;
      
      // Get user email from auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(user_id);
      if (authError) throw authError;

      usersToEmail = [{
        id: user.id,
        full_name: user.full_name,
        email: authUser.user.email,
      }];
    } else {
      // Find users who haven't logged in for 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      // Get users with role 'user' who haven't been active
      const { data: inactiveUsers, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'user');

      if (error) throw error;

      // Get auth data for these users
      for (const user of inactiveUsers || []) {
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(user.id);
        if (!authError && authUser.user.email) {
          // Check if user has TMI data
          const { data: summary } = await supabase
            .from('user_dreamline_summaries')
            .select('target_monthly_income')
            .eq('user_id', user.id)
            .single();

          if (summary && summary.target_monthly_income > 0) {
            usersToEmail.push({
              id: user.id,
              full_name: user.full_name,
              email: authUser.user.email,
              target_monthly_income: summary.target_monthly_income,
            });
          }
        }
      }
    }

    const emailResults = [];

    for (const user of usersToEmail) {
      try {
        // Get user's TMI data
        const { data: summary } = await supabase
          .from('user_dreamline_summaries')
          .select('target_monthly_income')
          .eq('user_id', user.id)
          .single();

        const firstName = user.full_name || user.email?.split('@')[0] || 'ผู้ใช้';
        const tmiValue = summary?.target_monthly_income || 0;

        const emailResponse = await resend.emails.send({
          from: "begins.guide <noreply@begins.guide>",
          to: [user.email],
          subject: `${firstName}, เป้าหมายชีวิตของคุณยังเหมือนเดิมไหม?`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0A2240; margin: 0;">begins.guide</h1>
              </div>
              
              <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #0A2240; margin-top: 0;">สวัสดีครับคุณ ${firstName},</h2>
                
                <p style="color: #444; line-height: 1.6; margin-bottom: 20px;">
                  ผมจาก begins.guide นะครับ
                </p>
                
                <p style="color: #444; line-height: 1.6; margin-bottom: 20px;">
                  เมื่อประมาณ 3 เดือนก่อน คุณได้เข้ามาออกแบบ "พิมพ์เขียวชีวิต" และค้นพบ "ตัวเลขแห่งอิสรภาพ" ของคุณเอง ซึ่งก็คือ:
                </p>
                
                <div style="background: #fff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border-left: 4px solid #FFD707;">
                  <h3 style="color: #0A2240; margin: 0 0 10px 0;">Target Monthly Income</h3>
                  <div style="font-size: 32px; font-weight: bold; color: #0A2240;">฿${tmiValue.toLocaleString()}</div>
                  <div style="color: #666; margin-top: 5px;">ต่อเดือน</div>
                </div>
                
                <p style="color: #444; line-height: 1.6; margin-bottom: 30px;">
                  การเดินทางของชีวิตมักมีการเปลี่ยนแปลงเสมอ... ลองกลับมาทบทวนและอัปเดตพิมพ์เขียวของคุณ เพื่อให้แน่ใจว่าคุณยังคงเดินอยู่บนเส้นทางที่ถูกต้องนะครับ
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://begins.guide/dashboard" style="display: inline-block; background: #0A2240; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    กลับไปทบทวนพิมพ์เขียวของฉัน
                  </a>
                </div>
                
                <p style="color: #444; line-height: 1.6; margin-top: 30px;">
                  ขอให้มีความสุขกับการออกแบบชีวิตนะครับ,<br>
                  <strong>ทีม begins.guide</strong>
                </p>
              </div>
              
              <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
                <p>หากคุณไม่ต้องการรับอีเมลนี้อีก กรุณาแจ้งให้เราทราบ</p>
              </div>
            </div>
          `,
        });

        emailResults.push({
          user_id: user.id,
          email: user.email,
          success: true,
          message_id: emailResponse.data?.id,
        });

        console.log(`Re-engagement email sent to ${user.email}`);

      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
        emailResults.push({
          user_id: user.id,
          email: user.email,
          success: false,
          error: emailError.message,
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Re-engagement emails processed for ${usersToEmail.length} users`,
      results: emailResults,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-reengagement-email function:", error);
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