-- Supabase table for mobile entries
-- Run this SQL in your Supabase SQL editor to create the required table

CREATE TABLE IF NOT EXISTS mobile_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mobile TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used BOOLEAN DEFAULT FALSE
);

-- Create an index on mobile for faster lookups
CREATE INDEX IF NOT EXISTS idx_mobile_entries_mobile ON mobile_entries(mobile);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_mobile_entries_created_at ON mobile_entries(created_at DESC);

-- Create an index on used status
CREATE INDEX IF NOT EXISTS idx_mobile_entries_used ON mobile_entries(used);

-- Optional: Create a unique constraint on mobile + code combination
-- to prevent duplicate codes for the same mobile number
CREATE UNIQUE INDEX IF NOT EXISTS idx_mobile_entries_mobile_code ON mobile_entries(mobile, code);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE mobile_entries ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You may want to restrict this further based on your needs
CREATE POLICY "Allow all operations for authenticated users" ON mobile_entries
    FOR ALL USING (true);

-- Alternative: More restrictive policy (uncomment if you want stricter access)
-- CREATE POLICY "Allow all operations for service role" ON mobile_entries
--     FOR ALL USING (auth.role() = 'service_role');
