
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BulkEmailRequest {
  recipients: string[];
  subject: string;
  content: string;
  template_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { recipients, subject, content, template_id }: BulkEmailRequest = await req.json();

    // Validate input
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new Error('Recipients array is required and must not be empty');
    }

    if (!subject || !content) {
      throw new Error('Subject and content are required');
    }

    // Process each recipient
    const results = [];
    for (const email of recipients) {
      try {
        // In production, this would integrate with a real email service like SendGrid, Mailgun, etc.
        // For now, we'll just log and save to database
        console.log(`Sending email to: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content: ${content}`);

        // Log the email attempt
        const { error: logError } = await supabaseClient
          .from('email_logs')
          .insert({
            template_id,
            recipient_email: email,
            subject,
            status: 'sent',
            sent_by: null // For bulk emails, no specific sender
          });

        if (logError) {
          console.error('Error logging email:', logError);
          results.push({ email, status: 'logged_error', error: logError.message });
        } else {
          results.push({ email, status: 'sent' });
        }

      } catch (emailError) {
        console.error(`Error sending to ${email}:`, emailError);
        
        // Log failed attempt
        await supabaseClient
          .from('email_logs')
          .insert({
            template_id,
            recipient_email: email,
            subject,
            status: 'failed',
            error_message: emailError.message,
            sent_by: null
          });

        results.push({ email, status: 'failed', error: emailError.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${recipients.length} emails`,
        results 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Bulk email error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
