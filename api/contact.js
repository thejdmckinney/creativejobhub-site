// Vercel Serverless Function to handle contact form submissions with Supabase
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get environment variables from Vercel Edge Runtime
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check (Edge Runtime):', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey,
      urlPrefix: supabaseUrl?.substring(0, 20)
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing from environment');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error - missing credentials',
          debug: 'Environment variables not found in Edge Runtime'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse form data
    console.log('Parsing request body...');
    const formData = await req.json();
    console.log('Form data received:', { email: formData.email, hasName: !!formData.name });
    
    const { name, email, phone, company, message, page_url, referrer, timestamp } = formData;

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed:', { hasName: !!name, hasEmail: !!email, hasMessage: !!message });
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare the data object
    const leadData = {
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
    };

    console.log('Inserting into Supabase...', { email: leadData.email, source: leadData.source });

    // Insert contact form submission into Supabase (matching existing schema)
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to submit form. Please try again.',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Success! Lead inserted:', data[0]?.id);

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
    console.error('Contact form error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred. Please try again.',
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
