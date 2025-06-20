
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
    const { product_ids, amount } = await req.json();
    
    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0 || !amount) {
      throw new Error("Product IDs and amount are required");
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

    // สร้างคำสั่งซื้อ
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: amount,
        status: 'pending',
        payment_provider: 'promptpay'
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error("Failed to create order");
    }

    // สร้าง order items
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('id, price')
      .in('id', product_ids);

    if (productsError || !products) {
      throw new Error("Failed to fetch products");
    }

    const orderItems = products.map(product => ({
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      price: product.price
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error("Failed to create order items");
    }

    // สร้าง PromptPay QR Code ผ่าน Omise API
    const omiseResponse = await fetch("https://api.omise.co/sources", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(Deno.env.get("OMISE_SECRET_KEY") + ":")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "amount": (amount * 100).toString(),
        "currency": "THB",
        "type": "promptpay",
      }),
    });

    const sourceData = await omiseResponse.json();

    if (!omiseResponse.ok) {
      throw new Error("Failed to create PromptPay source");
    }

    // อัปเดต order ด้วย source ID
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        provider_payment_id: sourceData.id
      })
      .eq('id', order.id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        qr_code: sourceData.scannable_code.image.download_uri,
        payment_ref: order.id,
        source_id: sourceData.id
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
