
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
    const { token, order_id, amount } = await req.json();
    
    if (!token || !order_id || !amount) {
      throw new Error("Missing required parameters");
    }

    // สร้าง Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // สร้าง charge ผ่าน Omise API
    const omiseResponse = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(Deno.env.get("OMISE_SECRET_KEY") + ":")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "amount": amount.toString(),
        "currency": "THB",
        "card": token,
        "description": `Order ${order_id}`,
      }),
    });

    const chargeData = await omiseResponse.json();

    if (!omiseResponse.ok || !chargeData.paid) {
      throw new Error(chargeData.failure_message || "Payment failed");
    }

    // อัปเดตสถานะคำสั่งซื้อ
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        status: 'completed',
        provider_payment_id: chargeData.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id);

    if (updateError) {
      throw updateError;
    }

    // ดึงข้อมูล order items เพื่อสร้าง user purchases
    const { data: orderItems, error: itemsError } = await supabaseClient
      .from('order_items')
      .select('product_id')
      .eq('order_id', order_id);

    if (itemsError || !orderItems) {
      throw new Error("Failed to fetch order items");
    }

    // ดึงข้อมูล order เพื่อหา user_id
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('user_id')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      throw new Error("Failed to fetch order");
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
      JSON.stringify({ 
        success: true,
        charge_id: chargeData.id
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
