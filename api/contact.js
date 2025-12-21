// Vercel Serverless Function to handle contact form submissions with Supabase
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse form data
    const formData = await req.json();
    const { name, email, phone, company, message, page_url, referrer, timestamp } = formData;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for server-side

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert contact form submission into Supabase (matching existing schema)
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          email: email.trim().toLowerCase(),
          business_type: company?.trim() || null,
          source: 'website_contact_form',
          action: 'contact_form_submitted',
          metadata: {
            name: name.trim(),
            phone: phone?.trim() || null,
            company: company?.trim() || null,
            message: message.trim(),
            page_url: page_url || null,
            referrer: referrer || null,
            submitted_at: timestamp || new Date().toISOString(),
            user_agent: req.headers.get('user-agent') || null,
            ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null
          }
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit form. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Optional: Send email notification (you can add Resend, SendGrid, etc. here)
    // await sendEmailNotification(formData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for contacting us! We\'ll get back to you soon.',
        id: data[0].id 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Adjust based on your domain
        } 
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
