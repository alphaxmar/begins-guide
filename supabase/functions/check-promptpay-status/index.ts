
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

    // ดึงข้อมูล order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', payment_ref)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    // ตรวจสอบสถานะจาก Omise
    if (order.provider_payment_id) {
      const omiseResponse = await fetch(`https://api.omise.co/sources/${order.provider_payment_id}`, {
        headers: {
          "Authorization": `Basic ${btoa(Deno.env.get("OMISE_SECRET_KEY") + ":")}`,
        },
      });

      const sourceData = await omiseResponse.json();

      if (omiseResponse.ok && sourceData.flow === 'redirect' && sourceData.charges?.data?.length > 0) {
        const charge = sourceData.charges.data[0];
        
        if (charge.paid) {
          // อัปเดตสถานะคำสั่งซื้อ
          const { error: updateError } = await supabaseClient
            .from('orders')
            .update({
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id);

          if (updateError) {
            throw updateError;
          }

          // ดึงข้อมูล order items เพื่อสร้าง user purchases
          const { data: orderItems, error: itemsError } = await supabaseClient
            .from('order_items')
            .select('product_id')
            .eq('order_id', order.id);

          if (itemsError || !orderItems) {
            throw new Error("Failed to fetch order items");
          }

          // สร้าง user purchases
          const purchases = orderItems.map(item => ({
            user_id: order.user_id,
            product_id: item.product_id
          }));

          const { error: purchasesError } = await supabaseClient
            .from('user_purchases')
            .insert(purchases);

          if (purchasesError) {
            console.error("Failed to create user purchases:", purchasesError);
          }

          return new Response(
            JSON.stringify({ status: 'completed' }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        } else if (charge.failure_code) {
          // อัปเดตสถานะเป็น failed
          await supabaseClient
            .from('orders')
            .update({
              status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id);

          return new Response(
            JSON.stringify({ status: 'failed' }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ status: 'pending' }),
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
