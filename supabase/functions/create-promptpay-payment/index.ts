
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
    console.log("=== Start create-promptpay-payment ===");
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));

    let requestBody;
    try {
      const bodyText = await req.text();
      console.log("Raw body text:", bodyText);
      
      if (!bodyText || bodyText.trim() === '') {
        throw new Error("Request body is empty");
      }
      
      requestBody = JSON.parse(bodyText);
      console.log("Parsed request body:", requestBody);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { product_ids, amount } = requestBody;
    
    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      console.error("Invalid product_ids:", product_ids);
      return new Response(
        JSON.stringify({ error: "Product IDs are required and must be an array" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.error("Invalid amount:", amount);
      return new Response(
        JSON.stringify({ error: "Amount is required and must be a positive number" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Creating PromptPay payment with:", { product_ids, amount });

    // สร้าง Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ดึงข้อมูลผู้ใช้จาก JWT (ถ้ามี)
    let userId = null;
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
        
        if (!authError && user) {
          userId = user.id;
          console.log("User authenticated:", userId);
        } else {
          console.log("Auth warning:", authError?.message || "No user found");
        }
      } catch (authError) {
        console.log("Auth error (continuing without user):", authError);
      }
    } else {
      console.log("No Authorization header provided");
    }

    // ดึงข้อมูล PromptPay จากการตั้งค่า
    const { data: paymentSettings, error: settingsError } = await supabaseClient
      .from('payment_settings')
      .select('promptpay_number')
      .eq('id', 1)
      .single();

    if (settingsError) {
      console.error("Settings error:", settingsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch payment settings" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    if (!paymentSettings?.promptpay_number) {
      console.error("PromptPay number not configured");
      return new Response(
        JSON.stringify({ error: "PromptPay number not configured" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const promptPayNumber = paymentSettings.promptpay_number;
    console.log("PromptPay number:", promptPayNumber);

    // สร้างคำสั่งซื้อ (ถ้ามีผู้ใช้)
    let orderId = 'GUEST_' + Date.now().toString(36).toUpperCase();
    
    if (userId) {
      try {
        const { data: order, error: orderError } = await supabaseClient
          .from('orders')
          .insert({
            user_id: userId,
            total_amount: amount,
            status: 'pending',
            payment_provider: 'promptpay'
          })
          .select()
          .single();

        if (orderError) {
          console.error("Order error:", orderError);
          // ไม่ throw error แต่ใช้ guest order ID
          console.log("Using guest order ID instead");
        } else {
          orderId = order.id;
          console.log("Order created:", orderId);

          // สร้าง order items
          const { data: products, error: productsError } = await supabaseClient
            .from('products')
            .select('id, price')
            .in('id', product_ids);

          if (!productsError && products) {
            const orderItems = products.map(product => ({
              order_id: orderId,
              product_id: product.id,
              quantity: 1,
              price: product.price
            }));

            const { error: itemsError } = await supabaseClient
              .from('order_items')
              .insert(orderItems);

            if (itemsError) {
              console.error("Items error:", itemsError);
              // ไม่ throw error แต่ log warning
              console.log("Failed to create order items but continuing");
            }
          }
        }
      } catch (orderCreationError) {
        console.error("Order creation failed:", orderCreationError);
        console.log("Using guest order ID instead");
      }
    }

    // สร้าง PromptPay QR Code data
    const qrData = `00020101021129370016A000000677010111011${promptPayNumber.length.toString().padStart(2, '0')}${promptPayNumber}53037645802TH5916BEGINS GUIDE LTD6007Bangkok62410007${orderId.toString().slice(0, 8)}6304`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

    console.log("QR Code URL generated:", qrCodeUrl);

    const response = {
      qr_code: qrCodeUrl,
      payment_ref: orderId,
      promptpay_number: promptPayNumber,
      amount: amount
    };

    console.log("Returning response:", response);

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
