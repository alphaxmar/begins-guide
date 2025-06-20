
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
    const { product_ids } = await req.json();
    
    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      throw new Error("Product IDs are required");
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

    // คำนวณราคารวม
    const { data: products, error: productsError } = await supabaseClient
      .from('products')
      .select('id, price')
      .in('id', product_ids);

    if (productsError || !products) {
      throw new Error("Failed to fetch products");
    }

    const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

    // สร้างคำสั่งซื้อ
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: 'pending',
        payment_provider: 'omise'
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error("Failed to create order");
    }

    // สร้าง order items
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

    return new Response(
      JSON.stringify({ 
        order_id: order.id,
        total_amount: totalAmount
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
