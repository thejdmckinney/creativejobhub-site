-- Supabase SQL Schema for Contact Form Submissions
-- Run this in your Supabase SQL Editor to create the table

-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'spam', 'archived')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Create index on submitted_at for date range queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at ON contact_submissions(submitted_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert (your API will use this)
CREATE POLICY "Allow service role to insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy to allow authenticated users to view all submissions (for your admin dashboard)
CREATE POLICY "Allow authenticated users to view contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update submissions (for status changes)
CREATE POLICY "Allow authenticated users to update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on row updates
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for quick stats
CREATE OR REPLACE VIEW contact_submission_stats AS
SELECT 
  COUNT(*) as total_submissions,
  COUNT(*) FILTER (WHERE status = 'new') as new_submissions,
  COUNT(*) FILTER (WHERE status = 'contacted') as contacted_submissions,
  COUNT(*) FILTER (WHERE status = 'qualified') as qualified_submissions,
  COUNT(*) FILTER (WHERE status = 'converted') as converted_submissions,
  COUNT(*) FILTER (WHERE submitted_at > NOW() - INTERVAL '7 days') as submissions_last_7_days,
  COUNT(*) FILTER (WHERE submitted_at > NOW() - INTERVAL '30 days') as submissions_last_30_days
FROM contact_submissions;

-- Grant select on the view to authenticated users
GRANT SELECT ON contact_submission_stats TO authenticated;

COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the website';
COMMENT ON COLUMN contact_submissions.status IS 'Tracks the lifecycle of each contact submission';
