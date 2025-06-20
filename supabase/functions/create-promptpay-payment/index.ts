
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

    // ดึงข้อมูล PromptPay จากการตั้งค่า (ใช้หมายเลขตัวอย่างถ้าไม่มีการตั้งค่า)
    const promptPayNumber = "0962358979"; // ใช้หมายเลขจากรูปที่แสดง

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

    // สร้าง PromptPay QR Code URL
    // ใช้ API ของธนาคารหรือ Third party service สำหรับสร้าง QR Code
    // ตัวอย่างนี้ใช้ service ฟรีสำหรับสร้าง QR Code
    const qrData = `00020101021230320000005802TH5909${promptPayNumber}63${amount.toString().padStart(4, '0')}0406${order.id.slice(0, 6)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

    return new Response(
      JSON.stringify({ 
        qr_code: qrCodeUrl,
        payment_ref: order.id,
        promptpay_number: promptPayNumber,
        amount: amount
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
