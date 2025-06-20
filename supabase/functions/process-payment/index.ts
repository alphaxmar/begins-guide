
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  amount: number;
  currency: string;
  card_token: string;
  order_id: string;
  description?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { amount, currency, card_token, order_id, description }: PaymentRequest = await req.json();

    // Get Omise secret key from environment
    const omiseSecretKey = Deno.env.get("OMISE_SECRET_KEY");
    if (!omiseSecretKey) {
      throw new Error("Omise secret key not configured");
    }

    // Create charge with Omise
    const chargeData = {
      amount: amount * 100, // Omise uses cents/satang
      currency: currency || "thb",
      card: card_token,
      description: description || `Payment for order ${order_id}`,
    };

    const omiseResponse = await fetch("https://api.omise.co/charges", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(omiseSecretKey + ":")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chargeData),
    });

    const charge = await omiseResponse.json();

    if (!omiseResponse.ok) {
      throw new Error(`Omise error: ${charge.message || 'Payment failed'}`);
    }

    // Update order status in database
    if (charge.status === "successful") {
      const { error: updateError } = await supabaseClient
        .from("orders")
        .update({
          status: "completed",
          payment_provider: "omise",
          provider_payment_id: charge.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order_id);

      if (updateError) {
        console.error("Failed to update order status:", updateError);
      }
    }

    return new Response(JSON.stringify({ charge }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Payment processing error:", error);
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
