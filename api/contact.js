// Vercel Serverless Function to handle contact form submissions with Supabase
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

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

    // Send email notification via Resend
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px; background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8f 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-align: center;">
                🎯 New Contact Form Submission
              </h1>
              <p style="margin: 8px 0 0; color: #e0e7ff; font-size: 16px; text-align: center;">
                From ${websiteDomain}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Contact Information -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f8fafc; border-radius: 8px;">
                    <h2 style="margin: 0 0 16px; color: #1e3a5f; font-size: 18px; font-weight: 600;">
                      👤 Contact Information
                    </h2>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px; vertical-align: top;"><strong>Name:</strong></td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Email:</strong></td>
                        <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${email}</a></td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Phone:</strong></td>
                        <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #2563eb; text-decoration: none; font-size: 14px;">${phone}</a></td>
                      </tr>
                      ` : ''}
                      ${company ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Company:</strong></td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${company}</td>
                      </tr>
                      ` : ''}
                      ${business_type ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Industry:</strong></td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;"><span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 13px; font-weight: 600;">${business_type}</span></td>
                      </tr>
                      ` : ''}
                      ${otherFields.team_size ? `
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Team Size:</strong></td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${otherFields.team_size}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Message -->
              ${message ? `
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                    <h2 style="margin: 0 0 12px; color: #92400e; font-size: 18px; font-weight: 600;">
                      💬 Message
                    </h2>
                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- Tracking Info -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 16px; background-color: #f1f5f9; border-radius: 8px;">
                    <h3 style="margin: 0 0 12px; color: #475569; font-size: 14px; font-weight: 600;">
                      📊 Tracking Details
                    </h3>
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-size: 13px; width: 140px;">Source:</td>
                        <td style="padding: 4px 0; color: #334155; font-size: 13px;">${websiteDomain}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-size: 13px;">Page URL:</td>
                        <td style="padding: 4px 0; color: #334155; font-size: 13px; word-break: break-all;">${page_url || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-size: 13px;">Submitted:</td>
                        <td style="padding: 4px 0; color: #334155; font-size: 13px;">${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' })}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b; font-size: 13px;">Lead ID:</td>
                        <td style="padding: 4px 0; color: #334155; font-size: 13px; font-family: monospace;">${data[0]?.id || 'N/A'}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re: Your inquiry to Creative Job Hub" style="display: inline-block; padding: 14px 32px; background-color: #1e3a5f; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Reply to ${name.split(' ')[0]}
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                This notification was sent from your contact form on <strong>${websiteDomain}</strong>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        await resend.emails.send({
          from: 'Creative Job Hub <noreply@creativejobhub.com>',
          to: 'hello@creativejobhub.com',
          subject: `🎯 New ${business_type || 'Contact'} Lead from ${websiteDomain}`,
          html: emailHtml
        });
        
        console.log('Email notification sent successfully');
      } else {
        console.log('Resend API key not configured, skipping email notification');
      }
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error('Failed to send email notification:', emailError);
    }

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
