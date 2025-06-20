
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payment_ref } = await req.json();
    
    if (!payment_ref) {
      throw new Error("Payment reference is required");
    }

    // สร้าง Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ดึงข้อมูลผู้ใช้จาก JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Invalid user");
    }

    // ค้นหาคำสั่งซื้อ
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', payment_ref)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    // สำหรับ MVP: เพิ่มโอกาสจำลองการชำระเงินสำเร็จ 30%
    const isPaymentComplete = Math.random() < 0.3;

    if (isPaymentComplete && order.status === 'pending') {
      // อัปเดตสถานะเป็น completed
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment_ref);

      if (updateError) {
        throw new Error("Failed to update order status");
      }

      // เพิ่มสิทธิ์การเข้าถึงสินค้าให้ผู้ซื้อ
      const { data: orderItems, error: itemsError } = await supabaseClient
        .from('order_items')
        .select('product_id')
        .eq('order_id', payment_ref);

      if (!itemsError && orderItems) {
        for (const item of orderItems) {
          await supabaseClient
            .from('user_purchases')
            .insert({
              user_id: user.id,
              product_id: item.product_id
            })
            .on('conflict', (row) => row.ignore());
        }
      }

      return new Response(
        JSON.stringify({ 
          status: 'completed',
          message: 'Payment confirmed successfully'
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        status: order.status,
        message: order.status === 'completed' ? 'Payment already completed' : 'Payment pending'
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
