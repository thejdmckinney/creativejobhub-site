# Supabase Contact Form Setup Guide

## ✅ What's Been Updated

1. **API Endpoint Created**: `/api/contact.js` - Vercel serverless function
2. **Contact Form Updated**: `contact.html` now submits to Supabase instead of Formspree
3. **Schema Matched**: Uses your existing table structure:
   - `email` (text)
   - `business_type` (text) - populated from "company" field
   - `source` (text) - set to "website_contact_form"
   - `action` (text) - set to "contact_form_submitted"
   - `metadata` (jsonb) - stores all form data including name, phone, message, etc.

## 🚀 Deployment Steps

### 1. Install Dependencies in Vercel

The API function needs the Supabase JS client. Vercel will automatically install it from `package.json` when you deploy.

### 2. Add Environment Variables to Vercel

Go to your Vercel project dashboard:
1. Click **Settings** → **Environment Variables**
2. Add these two variables:

```
SUPABASE_URL = https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key-here
```

**Where to find these:**
- Go to your Supabase project: https://app.supabase.com
- Click **Settings** (gear icon) → **API**
- Copy the **Project URL** → This is your `SUPABASE_URL`
- Copy the **service_role key** (NOT the anon key) → This is your `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important**: Use the **service_role** key, not the anon key, since this runs server-side.

### 3. Ensure Your Supabase Table Exists

Your table should already exist with this structure:

```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  business_type TEXT,
  source TEXT,
  action TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Set Row Level Security (RLS) Policy

Run this in your Supabase SQL Editor if you haven't already:

```sql
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert (your API uses this)
CREATE POLICY "Allow service role to insert leads"
  ON leads
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow authenticated users to view leads (for your admin dashboard)
CREATE POLICY "Allow authenticated users to view leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);
```

### 5. Deploy to Vercel

```bash
git add .
git commit -m "Switch contact form from Formspree to Supabase"
git push origin main
```

Vercel will automatically deploy. The `/api/contact` endpoint will be live.

### 6. Test Your Form

1. Go to https://creativejobhub.com/contact.html
2. Fill out and submit the form
3. Check your Supabase dashboard → **Table Editor** → **leads** table
4. You should see a new row with:
   - `email`: the submitted email
   - `source`: "website_contact_form"
   - `action`: "contact_form_submitted"
   - `metadata`: JSON object with all form fields

## 📊 Viewing Your Leads

You can query your leads in Supabase SQL Editor:

```sql
-- View all contact form submissions
SELECT 
  email,
  business_type,
  metadata->>'name' as name,
  metadata->>'phone' as phone,
  metadata->>'message' as message,
  created_at
FROM leads
WHERE source = 'website_contact_form'
ORDER BY created_at DESC;

-- Count submissions by day
SELECT 
  DATE(created_at) as submission_date,
  COUNT(*) as count
FROM leads
WHERE source = 'website_contact_form'
GROUP BY DATE(created_at)
ORDER BY submission_date DESC;
```

## 🔧 What Gets Stored

When someone submits your contact form, here's what gets saved:

```json
{
  "email": "customer@example.com",
  "business_type": "ACME Plumbing", 
  "source": "website_contact_form",
  "action": "contact_form_submitted",
  "metadata": {
    "name": "John Smith",
    "phone": "555-1234",
    "company": "ACME Plumbing",
    "message": "I'm interested in your software...",
    "team_size": "2-5",
    "page_url": "https://creativejobhub.com/contact.html",
    "referrer": "https://google.com",
    "submitted_at": "2025-12-20T12:34:56.789Z",
    "user_agent": "Mozilla/5.0...",
    "ip_address": "123.45.67.89"
  }
}
```

## 🐛 Troubleshooting

### Form submission fails with 500 error
- Check Vercel function logs: Vercel Dashboard → Functions → Select `/api/contact`
- Verify environment variables are set correctly
- Check Supabase service role key is correct

### Form submission fails with 400 error
- Required fields (name, email, message) must be filled
- Email must be valid format

### No data appearing in Supabase
- Verify the table name is `leads` (not `contact_submissions`)
- Check RLS policies allow service_role to insert
- Look at Vercel function logs for Supabase error messages

## 📧 Optional: Email Notifications

If you want to receive email notifications when someone submits the form, you can add an email service like Resend or SendGrid. Let me know if you need help with that!

## ✨ Benefits Over Formspree

1. **Your data, your database** - All leads stored in Supabase
2. **No monthly limits** - Unlimited form submissions
3. **Custom tracking** - Store any metadata you want
4. **Integration** - Connects with your existing lead tracking system
5. **Free** - No Formspree subscription needed
