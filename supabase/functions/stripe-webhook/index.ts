
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      console.error("Missing stripe-signature header");
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    const body = await req.text();
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log("Received webhook event:", event.type);

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Processing checkout.session.completed:", session.id);

        // Confirm payment in database
        const { error } = await supabaseService
          .rpc('confirm_stripe_payment', {
            p_stripe_session_id: session.id,
            p_stripe_payment_intent_id: session.payment_intent as string
          });

        if (error) {
          console.error('Error confirming payment:', error);
          throw error;
        }

        // Send purchase confirmation email
        try {
          const { data: orderData } = await supabaseService
            .from('orders')
            .select(`
              id,
              user_id,
              total_amount,
              profiles!inner(full_name),
              order_items(
                product_id,
                price,
                products(title)
              )
            `)
            .eq('stripe_session_id', session.id)
            .single();

          if (orderData) {
            const { error: emailError } = await supabaseService.functions.invoke('send-email-notifications', {
              body: {
                type: 'purchase_confirmation',
                to: session.customer_details?.email || '',
                data: {
                  user_name: orderData.profiles.full_name || 'ลูกค้า',
                  order_id: orderData.id,
                  products: orderData.order_items.map((item: any) => ({
                    title: item.products.title,
                    price: item.price
                  })),
                  total_amount: orderData.total_amount
                }
              }
            });

            if (emailError) {
              console.error('Error sending purchase confirmation email:', emailError);
            }
          }
        } catch (emailErr) {
          console.error('Error processing purchase confirmation email:', emailErr);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Processing payment_intent.payment_failed:", paymentIntent.id);

        // Update order status to failed
        const { error } = await supabaseService
          .from('orders')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
          console.error('Error updating failed payment:', error);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
