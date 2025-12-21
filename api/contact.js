// Vercel Serverless Function to handle contact form submissions with Supabase
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
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
    console.log('Form data received:', { 
      email: formData.email, 
      hasName: !!formData.name,
      business_type: formData.business_type,
      hasBizType: !!formData.business_type 
    });
    
    const { name, email, phone, company, business_type, message, page_url, referrer, timestamp, ...otherFields } = formData;

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed:', { hasName: !!name, hasEmail: !!email, hasMessage: !!message, hasBizType: !!business_type });
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Extract website domain from page_url for source tracking
    let websiteDomain = 'creativejobhub.com'; // default
    if (page_url) {
      try {
        const url = new URL(page_url);
        websiteDomain = url.hostname.replace('www.', '');
      } catch (e) {
        console.log('Could not parse page_url:', page_url);
      }
    }

    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare the data object
    // - business_type: industry from dropdown (HVAC, Plumbing, etc.)
    // - company_name: stored as top-level field
    const leadData = {
      name: name.trim(), // Top-level field for easy querying
      email: email.trim().toLowerCase(),
      company_name: company?.trim() || null, // Company name as top-level field
      business_type: business_type?.trim() || null, // Industry from dropdown
      source: websiteDomain, // Actual website domain (creativejobhub.com, metroplexpros.com, etc.)
      action: 'contact_form_submitted',
      metadata: {
        // Store all other form-specific fields
        phone: phone?.trim() || null,
        message: message.trim(),
        ...otherFields, // Captures team_size, service_needed, project_budget, etc.
        // Tracking data
        page_url: page_url || null,
        referrer: referrer || null,
        submitted_at: timestamp || new Date().toISOString(),
        user_agent: req.headers['user-agent'] || null,
        ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || null,
        form_type: 'contact_form'
      }
    };

    console.log('Inserting into Supabase lead_tracking table...', { 
      name: leadData.name,
      email: leadData.email, 
      source: leadData.source 
    });

    // Try inserting without specifying schema (public is default)
    const { data, error } = await supabase
      .from('lead_tracking')
      .insert(leadData)
      .select();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // More helpful error message
      if (error.message.includes('schema cache')) {
        return res.status(500).json({ 
          error: 'Database table not found. Please verify the "lead_tracking" table exists in your Supabase database.',
          details: error.message 
        });
      }
      
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
};
