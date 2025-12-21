// Vercel Serverless Function to handle contact form submissions with Supabase
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get environment variables (Node.js runtime)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('Environment check (Node.js Runtime):', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey,
      urlPrefix: supabaseUrl?.substring(0, 20)
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing from environment');
      return res.status(500).json({ 
        error: 'Server configuration error - missing credentials',
        debug: 'Check Vercel environment variables are set'
      });
    }

    // Parse form data
    console.log('Parsing request body...');
    const formData = req.body;
    console.log('Form data received:', { email: formData.email, hasName: !!formData.name });
    
    const { name, email, phone, company, message, page_url, referrer, timestamp } = formData;

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed:', { hasName: !!name, hasEmail: !!email, hasMessage: !!message });
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email address' });
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
        user_agent: req.headers['user-agent'] || null,
        ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || null
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
      return res.status(500).json({ 
        error: 'Failed to submit form. Please try again.',
        details: error.message 
      });
    }

    console.log('Success! Lead inserted:', data[0]?.id);

    return res.status(200).json({ 
      success: true, 
      message: 'Thank you for contacting us! We\'ll get back to you soon.',
      id: data[0].id 
    });

  } catch (error) {
    console.error('Contact form error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again.',
      details: error.message 
    });
  }
}
