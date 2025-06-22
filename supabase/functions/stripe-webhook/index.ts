
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

        // Handle subscription checkout
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          // Create or update VIP membership for subscription
          const { error: vipError } = await supabaseService
            .from('vip_memberships')
            .upsert({
              user_id: session.client_reference_id,
              stripe_subscription_id: subscription.id,
              status: 'active',
              current_period_end_at: new Date(subscription.current_period_end * 1000).toISOString(),
              is_active: true,
              start_date: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });

          if (vipError) {
            console.error('Error creating VIP membership:', vipError);
            throw vipError;
          }

          // Update user role to vip
          const { error: roleError } = await supabaseService
            .from('profiles')
            .update({ role: 'vip' })
            .eq('id', session.client_reference_id);

          if (roleError) {
            console.error('Error updating user role:', roleError);
          }
        } else {
          // Handle one-time payment (existing logic)
          const { error } = await supabaseService
            .rpc('confirm_stripe_payment', {
              p_stripe_session_id: session.id,
              p_stripe_payment_intent_id: session.payment_intent as string
            });

          if (error) {
            console.error('Error confirming payment:', error);
            throw error;
          }
        }

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Processing ${event.type}:`, subscription.id);

        const { error } = await supabaseService
          .rpc('update_subscription_status', {
            p_stripe_subscription_id: subscription.id,
            p_status: subscription.status as any,
            p_current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          });

        if (error) {
          console.error('Error updating subscription:', error);
          throw error;
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Processing customer.subscription.deleted:", subscription.id);

        const { error } = await supabaseService
          .rpc('update_subscription_status', {
            p_stripe_subscription_id: subscription.id,
            p_status: 'canceled'
          });

        if (error) {
          console.error('Error canceling subscription:', error);
          throw error;
        }

        // Update user role back to user
        const { data: membership } = await supabaseService
          .from('vip_memberships')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (membership) {
          await supabaseService
            .from('profiles')
            .update({ role: 'user' })
            .eq('id', membership.user_id);
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Processing invoice.payment_succeeded:", invoice.id);

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          const { error } = await supabaseService
            .rpc('update_subscription_status', {
              p_stripe_subscription_id: subscription.id,
              p_status: subscription.status as any,
              p_current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            });

          if (error) {
            console.error('Error updating subscription after payment:', error);
          }
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Processing invoice.payment_failed:", invoice.id);

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          const { error } = await supabaseService
            .rpc('update_subscription_status', {
              p_stripe_subscription_id: subscription.id,
              p_status: subscription.status as any,
              p_current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            });

          if (error) {
            console.error('Error updating subscription after failed payment:', error);
          }
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Processing payment_intent.payment_failed:", paymentIntent.id);

        // Update order status to failed (for one-time payments)
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
